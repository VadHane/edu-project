using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Lab3.Models;
using Lab3.Exceptions;
using Lab3.Interfaces;

namespace Lab3.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService service)
        {
            _userService = service;
        }

        /// <summary>
        /// The endpoint for get all users.
        /// </summary>
        /// <returns>Return all user instances from the database as JSON strings and send status code 200.</returns>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult<User[]> Get()
        {
            try
            {
                var users = _userService.ReadAll();

                return Ok(users.ToList());
            }
            catch (DatabaseIsEmptyException)
            {
                return NoContent();
            } 
            catch
            {
                return StatusCode(500);
            }
        }

        /// <summary>
        /// The endpoint for get one user by id.
        /// </summary>
        /// <param name="id">The unique user id.</param>
        /// <returns>Return one user's instance from the database by id as JSON string and send status code 200.</returns>
        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<User> Get(Guid id)
        {
            try
            {
                var user = _userService.ReadOne(id);

                return Ok(user);
            }
            catch (DatabaseIsEmptyException)
            {
                return NoContent();
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        /// <summary>
        /// The endpoint for create new user.
        /// </summary>
        /// <param name="userCreateRequest">The user instance witch was generated from the request body.</param>
        /// <returns>Return the created user instance from the database as a JSON string and send status code 201.</returns>
        [AllowAnonymous]
        [HttpPost]
        public ActionResult<User> Post([FromForm]UserCreateUpdateRequest userCreateRequest)
        {
            try
            {
                var image = Request?.Form?.Files[0];
                var roles = JsonConvert.DeserializeObject<List<Role>>(userCreateRequest.Roles);
                var user = new User()
                {
                   FirstName = userCreateRequest.FirstName,
                   LastName = userCreateRequest.LastName,
                   Email = userCreateRequest.Email,
                   Password = userCreateRequest.Password,
                   Roles = roles
                };

                var createdUser = _userService.Create(user, image);
                var protocol = Request.IsHttps ? "https://" : "http://";
                var path = Request.Path + createdUser.Id;
                var uriToCreatedUser = new UriBuilder(protocol, Request.Host.Host, (int)Request.Host.Port, path).Uri;

                return Created(uriToCreatedUser, createdUser);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        /// <summary>
        /// The endpoint for update user by id.
        /// </summary>
        /// <param name="id">The unique user id.</param>
        /// <param name="userCreateRequest">The user instance witch was generated from the request body.</param>
        /// <returns>Return the updated user instance from the database as a JSON string and send status code 200.</returns>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public ActionResult<User> Put(Guid id, [FromForm]UserCreateUpdateRequest userCreateRequest)
        {
            try
            {
                var image = Request?.Form?.Files[0];
                var roles = JsonConvert.DeserializeObject<List<Role>>(userCreateRequest.Roles);
                var user = new User()
                {
                    FirstName = userCreateRequest.FirstName,
                    LastName = userCreateRequest.LastName,
                    Email = userCreateRequest.Email,
                    Password = userCreateRequest.Password,
                    Roles = roles
                };

                var updatedUser = _userService.Update(id, user, image);

                return Ok(updatedUser);
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            } 
            catch
            {
                return StatusCode(500);
            }
        }

        /// <summary>
        /// The endpoint for delete user by id.
        /// </summary>
        /// <param name="id">The unique user id.</param>
        /// <returns>Return the deleted user instance from the database as a JSON string and send status code 200.</returns>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public ActionResult<User> Delete(Guid id)
        {
            try
            {
                var deletedUser = _userService.Delete(id);

                return Ok(deletedUser);
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

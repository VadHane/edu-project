using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Lab2.Models;
using Lab2.Services;
using Lab2.Exceptions;

namespace Lab2.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : Controller
    {
        private readonly IUserService userService;

        public UsersController(IUserService service)
        {
            userService = service;
        }

        [HttpGet]
        public ActionResult<User[]> Get()
        {
            try
            {
                var users = userService.ReadAll();

                return Ok(users);
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

        [HttpGet("{id}")]
        public ActionResult<User> Get(Guid id)
        {
            try
            {
                var user = userService.ReadOne(id);

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
                   Roles = roles
                };

                var createdUser = userService.Create(user, image);
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
                    Roles = roles
                };

                var updatedUser = userService.Update(id, user, image);

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

        [HttpDelete("{id}")]
        public ActionResult<User> Delete(Guid id)
        {
            try
            {
                var deletedUser = userService.Delete(id);

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

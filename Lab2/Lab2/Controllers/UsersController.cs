using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Models;
using Lab2.Services;
using Lab2.Exceptions;

namespace Lab2.Controllers
{
    /// <summary>
    /// Endpoints for queries with 'api/users/*' path.
    /// </summary>
    [ApiController]
    [Route("api/users")]
    public class UsersController : Controller
    {
        /// <summary>
        /// The instance of UserService for interaction with database.
        /// </summary>
        private readonly UserService userService;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="service">The instance of UserService for interaction with database.</param>
        public UsersController(UserService service)
        {
            userService = service;
        }

        /// <summary>
        /// The endpoint for get method with 'api/users' path.
        /// </summary>
        /// <returns>Return all user's entities from database as JSON string and send status code 200.</returns>
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

        /// <summary>
        /// The endpoint for get method with 'api/users/:id' path.
        /// </summary>
        /// <param name="id">The unique id of user.</param>
        /// <returns>Return one user's entity from database by id as JSON string and send status code 200.</returns>
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

        /// <summary>
        /// The endpoint for post method with 'api/users' path.
        /// </summary>
        /// <param name="user">The user's model, which generated from request body.</param>
        /// <returns>Return the created user entity from database as JSON string and send status code 201.</returns>
        [HttpPost]
        public ActionResult<User> Post([FromBody]User user)
        {
            try
            {
                var createdUser = userService.Create(user);
                var uriToCreatedUser = new UriBuilder(Request.IsHttps ? "https://" : "http://", Request.Host.Host, (int)Request.Host.Port, Request.Path + createdUser.Id).Uri;

                return Created(uriToCreatedUser, createdUser);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        /// <summary>
        /// The endpoint for put method with 'api/users/:id' path.
        /// </summary>
        /// <param name="id">The unique id of user.</param>
        /// <param name="user">The user's model, which generated from request body.</param>
        /// <returns>Return the updated user entity from database as JSON string and send status code 200.</returns>
        [HttpPut("{id}")]
        public ActionResult<User> Put(Guid id, [FromBody]User user)
        {
            try
            {
                var updatedUser = userService.Update(id, user);

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
        /// The endpoint for delete method with 'api/users/:id' path.
        /// </summary>
        /// <param name="id">The unique id of user.</param>
        /// <returns>Return the deleted user entity from database as JSON string and send status code 200.</returns>
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

using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Models;
using Lab2.Services;

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

                Response.StatusCode = 200;

                return users;
            }
            catch (Exception exception)
            {
                Response.StatusCode = exception.Message == Constants.DATABASE_IS_EMPTY_TEXT ? 204 : 500;

                return null;
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

                Response.StatusCode = 201;

                return createdUser;
            }
            catch
            {
                Response.StatusCode = 500;

                return null;
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

                Response.StatusCode = 200;

                return updatedUser;
            }
            catch (Exception exception)
            {
                Response.StatusCode = exception.Message == Constants.NOT_FOUND_EXCEPTION ? 404 : 500;

                return null;
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
                User deletedUser = userService.Delete(id);

                Response.StatusCode = 200;

                return deletedUser;
            }
            catch (Exception exception)
            {
                Response.StatusCode = exception.Message == Constants.NOT_FOUND_EXCEPTION ? 404 : 500;

                return null;
            }
        }
    }
}

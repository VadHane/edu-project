using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Models;
using Lab2.Services;

namespace Lab2.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : Controller
    {
        private readonly UserService userService;

        public UsersController(UserService service)
        {
            userService = service;
        }

        [HttpGet]
        public ActionResult<User[]> Get()
        {
            User[] users;

            Response.Headers.Add("Access-Control-Allow-Origin", "*");

            try
            {
                users = userService.ReadAll();

                Response.Headers.Add("Content-Type", "application/json");
                Response.StatusCode = 200;

                return users;
            }
            catch (Exception exception)
            {
                if (exception.Message == Constants.DATABASE_IS_EMPTY_TEXT)
                {
                    Response.StatusCode = 204; // no content status code
                    return null;
                }

                Response.StatusCode = 500; // Internal Server Error
                return null;
            }
        }

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

        [HttpPut("{id}")]
        public ActionResult<User> Put(Guid id, [FromBody]User user)
        {
            User updatedUser;

            try
            {
                updatedUser = userService.Update(id, user);

                Response.StatusCode = 200;

                return updatedUser;
            }
            catch (Exception exception)
            {
                if (exception.Message == Constants.NOT_FOUND_EXCEPTION)
                {
                    Response.StatusCode = 404;
                }
                else
                {
                    Response.StatusCode = 500;
                }

                return null;
            }
        }

        [HttpDelete("{id}")]
        public ActionResult<User> Delete(Guid id)
        {
            User deletedUser;

            try
            {
                deletedUser = userService.Delete(id);

                Response.StatusCode = 200;

                return deletedUser;
            }
            catch (Exception exception)
            {
                if (exception.Message == Constants.NOT_FOUND_EXCEPTION)
                {
                    Response.StatusCode = 404;
                }
                else
                {
                    Response.StatusCode = 500;
                }

                return null;
            }
        }
    }
}

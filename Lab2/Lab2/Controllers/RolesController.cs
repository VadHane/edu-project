using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Services;
using Lab2.Models;

namespace Lab2.Controllers
{
    /// <summary>
    /// Endpoints for queries with 'api/users/roles/*' path.
    /// </summary>
    [ApiController]
    [Route("api/users/roles")]
    public class RolesController : Controller
    {
        /// <summary>
        /// The instance of RoleService for interaction with database.
        /// </summary>
        private readonly RoleService roleService;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="service">The instance of RoleService for interaction with database.</param>
        public RolesController(RoleService service)
        {
            roleService = service;
        }

        /// <summary>
        /// The endpoint for get method with 'api/users/roles' path.
        /// </summary>
        /// <returns>Return all role's entities from database as JSON string and send status code 200.</returns>
        [HttpGet]
        public ActionResult<Role[]> Get()
        {
            try
            {
                var roles = roleService.ReadAll();

                Response.StatusCode = 200;

                return roles;
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
        /// <param name="role">The role's model, which generated from request body.</param>
        /// <returns>Return the created role entity from database as JSON string and send status code 201.</returns>
        [HttpPost]
        public ActionResult<Role> Post([FromBody]Role role)
        {
            try
            {
                var createdRole = roleService.Create(role);

                Response.StatusCode = 201;

                return createdRole;
            }
            catch
            {
                Response.StatusCode = 500;

                return null;
            }
        }
    }
}

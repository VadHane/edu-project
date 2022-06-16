using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Services;
using Lab2.Models;
using Lab2.Exceptions;

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
        private readonly IRoleService roleService;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="service">The instance of RoleService for interaction with database.</param>
        public RolesController(IRoleService service)
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

                return Ok(roles);
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
        /// The endpoint for get method with 'api/users/roles/:id' path.
        /// </summary>
        /// <param name="id">The unique id of role.</param>
        /// <returns>Return one role's entity from database by id as JSON string and send status code 200.</returns>
        [HttpGet("{id}")]
        public ActionResult<Role> Get(Guid id)
        {
            try
            {
                var role = roleService.ReadOne(id);

                return Ok(role);
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
        /// <param name="role">The role's model, which generated from request body.</param>
        /// <returns>Return the created role entity from database as JSON string and send status code 201.</returns>
        [HttpPost]
        public ActionResult<Role> Post([FromForm]Role role)
        {
            try
            {
                var createdRole = roleService.Create(role);
                var uriToCreatedRole = new UriBuilder(Request.IsHttps ? "https://" : "http://", Request.Host.Host, (int)Request.Host.Port, Request.Path + createdRole.Id).Uri;

                return Created(uriToCreatedRole, createdRole);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

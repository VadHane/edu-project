using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Services;
using Lab2.Models;
using Lab2.Exceptions;

namespace Lab2.Controllers
{
    [ApiController]
    [Route("api/users/roles")]
    public class RolesController : Controller
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService service)
        {
            _roleService = service;
        }

        [HttpGet]
        public ActionResult<Role[]> Get()
        {
            try
            {
                var roles = _roleService.ReadAll();

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

        [HttpGet("{id}")]
        public ActionResult<Role> Get(Guid id)
        {
            try
            {
                var role = _roleService.ReadOne(id);

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

        [HttpPost]
        public ActionResult<Role> Post([FromForm]Role role)
        {
            try
            {
                var createdRole = _roleService.Create(role);
                var protocol = Request.IsHttps ? "https://" : "http://";
                var path = Request.Path + createdRole.Id;
                var uriToCreatedRole = new UriBuilder(protocol, Request.Host.Host, (int)Request.Host.Port, path).Uri;

                return Created(uriToCreatedRole, createdRole);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

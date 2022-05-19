using System;
using Microsoft.AspNetCore.Mvc;
using Lab2.Services;
using Lab2.Models;

namespace Lab2.Controllers
{
    [ApiController]
    [Route("api/users/roles")]
    public class RolesController : Controller
    {
        public RoleService EService { get; set; }

        public RolesController(RoleService service)
        {
            EService = service;
        }

        [HttpGet]
        public ActionResult<Role[]> Get()
        {
            Role[] roles;

            Response.Headers.Add("Access-Control-Allow-Origin", "*");

            try
            {
                roles = EService.ReadAll();

                Response.Headers.Add("Content-Type", "application/json");
                Response.StatusCode = 200;

                return roles;
            }
            catch (Exception exception)
            {
                if (exception.Message == Constants.DATABASE_IS_EMPTY_TEXT)
                {
                    Response.StatusCode = 204; // no content status code
                }
                else
                {
                    Response.StatusCode = 500; // Internal Server Error
                }

                return null;
            }
        }

        [HttpPost]
        public ActionResult<Role> Post([FromBody]Role role)
        {
            Role createdRole;

            try
            {
                createdRole = EService.Create(role);

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

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/models/{id}")]
    public class HistoriesController : Controller
    {
        private readonly IHistoryService _historyService;

        public HistoriesController(IHistoryService service)
        {
            _historyService = service;
        }

        [HttpGet("/history")]
        public ActionResult<IEnumerable<ModelHistory>> Get(Guid id)
        {
            try
            {
                var history = _historyService.ReadAll(id);

                if (!history.Any())
                {
                    return BadRequest();
                }

                return Ok(history);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

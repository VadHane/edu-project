using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Lab3.Exceptions;
using Lab3.Interfaces;
using Lab3.Models;

namespace Lab3.Controllers
{
    [ApiController]
    [Route("api/models")]
    public class ModelsController : Controller
    {
        private readonly IModelService _modelService;

        public ModelsController(IModelService modelService)
        {
            _modelService = modelService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Model>> Get()
        {
            try
            {
                var models = _modelService.ReadAll();

                if (!models.Any())
                {
                    return NoContent();
                }

                return Ok(models);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        public ActionResult<Model> Get(Guid id)
        {
            try
            {
                var model = _modelService.ReadOne(id);

                return Ok(model);
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
        public ActionResult<Model> Post([FromForm]ModelCreateUpdateRequest modelCreateRequest)
        {
            try
            {
                var tags = JsonConvert.DeserializeObject<List<Tag>>(modelCreateRequest.Tags);
                var model = new Model()
                {
                    Name = modelCreateRequest.Name,
                    Description = modelCreateRequest.Description,
                    CreatedAt = DateTime.Now,
                    CreatedBy = modelCreateRequest.CreatedBy,
                    UpdatedBy = modelCreateRequest.UpdatedBy,
                    UpdatedAt = DateTime.Now,
                    Filekey = modelCreateRequest.Filekey,
                    PrevBlobKey = modelCreateRequest.PrevBlobKey,
                    Tags = tags,
                };

                var createdModel = _modelService.Create(model);
                var protocol = Request.IsHttps ? "https://" : "http://";
                var path = Request.Path + createdModel.Id;
                var uriToCreatedModel = new UriBuilder(protocol, Request.Host.Host, (int)Request.Host.Port, path).Uri;

                return Created(uriToCreatedModel, createdModel);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut("{id}")]
        public ActionResult<Model> Put(Guid id, [FromForm]ModelCreateUpdateRequest modelUpdateRequest)
        {
            try
            {
                var tags = JsonConvert.DeserializeObject<List<Tag>>(modelUpdateRequest.Tags);
                var model = new Model()
                {
                    Name = modelUpdateRequest.Name,
                    Description = modelUpdateRequest.Description,
                    UpdatedBy = modelUpdateRequest.UpdatedBy,
                    UpdatedAt = DateTime.Now,
                    Tags = tags,
                };

                var updatedModel = _modelService.Update(id, model);

                return Ok(updatedModel);
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
        public ActionResult<Model> Delete(Guid id)
        {
            try
            {
                var deletedModel = _modelService.Delete(id);

                return Ok(deletedModel);
            }
            catch (EntityNotFoundException)
            {
                return NoContent();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

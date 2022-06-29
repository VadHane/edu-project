using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
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
        private readonly string[] CADFileExtentions = { ".cad" };
        private readonly string[] previewFileExtentions = { ".png", ".jpeg", ".jpg" };

        public ModelsController(IModelService modelService)
        {
            _modelService = modelService;
        }

        private (IFormFile file, IFormFile preview) ValidateFiles(IFormFileCollection files)
        {
            if (files == null || files.Count < 2)
            {
                return (null, null);
            }

            IFormFile file = null, preview = null;

            foreach (var formFile in files)
            {
                var formFileExtention = Path.GetExtension(formFile.FileName);

                if (CADFileExtentions.Contains(formFileExtention) && file == null)
                {
                    file = formFile;
                }

                if (previewFileExtentions.Contains(formFileExtention) && preview == null)
                {
                    preview = formFile;
                }
            }

            return (file, preview);
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
                var (file, preview) = ValidateFiles(Request?.Form?.Files); 

                if (file == null || preview == null)
                {
                    return BadRequest();
                }

                var tags = JsonConvert.DeserializeObject<List<Tag>>(modelCreateRequest.Tags);
                var model = new Model()
                {
                    Name = modelCreateRequest.Name,
                    Description = modelCreateRequest.Description,
                    CreatedAt = DateTime.Now,
                    CreatedBy = modelCreateRequest.CreatedBy,
                    UpdatedBy = modelCreateRequest.UpdatedBy,
                    UpdatedAt = DateTime.Now,
                    Tags = tags,
                };

                var createdModel = _modelService.Create(model, file, preview);
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
                var (file, preview) = ValidateFiles(Request?.Form?.Files);

                if (file == null || preview == null)
                {
                    return BadRequest();
                }

                var tags = JsonConvert.DeserializeObject<List<Tag>>(modelUpdateRequest.Tags);
                var model = new Model()
                {
                    Name = modelUpdateRequest.Name,
                    Description = modelUpdateRequest.Description,
                    UpdatedBy = modelUpdateRequest.UpdatedBy,
                    UpdatedAt = DateTime.Now,
                    Tags = tags,
                };

                var updatedModel = _modelService.Update(id, model, file, preview);

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

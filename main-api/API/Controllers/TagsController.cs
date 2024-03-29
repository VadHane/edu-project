﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using API.Exceptions;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/models/tags/")]
    public class TagsController : Controller
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService service)
        {
            _tagService = service;
        }

        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<Tag>> Get()
        {
            try
            {
                var tags = _tagService.ReadAll();

                if (!tags.Any())
                {
                    return NoContent();
                }

                return Ok(tags);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<Tag> Get(Guid id)
        {
            try
            {
                var tag = _tagService.ReadOne(id);

                return Ok(tag);
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public ActionResult<Tag> Post([FromForm]Tag tag)
        {
            try
            {
                var createdTag = _tagService.Create(tag);
                var protocol = Request.IsHttps ? "https://" : "http://";
                var path = Request.Path + createdTag.Id;
                var uriToCreatedTag = new UriBuilder(protocol, Request.Host.Host, (int)Request.Host.Port, path).Uri;

                return Created(uriToCreatedTag, createdTag);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using API.Exceptions;
using API.Interfaces;
using API.Models;

namespace API.Services
{
    public class ModelService : IModelService
    {
        private readonly ModelContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        public ModelService(ModelContext context, IWebHostEnvironment env, IConfiguration config)
        {
            _context = context;
            _env = env;
            _config = config;
        }

        private void AssignTagsToModel(ICollection<Tag> tags, Model model)
        {
            foreach(var tag in tags)
            {
                var foundTag = _context.Tags.AsNoTracking().FirstOrDefault(_tag => _tag.Id == tag.Id);

                if (foundTag != null && model.Tags.FirstOrDefault(_tag => _tag.Id == foundTag.Id) == null)
                {
                    _context.Entry(tag).State = EntityState.Unchanged;
                    model.Tags.Add(tag);
                }
            }

            var copyTags = new List<Tag>(model.Tags);

            foreach (var tag in copyTags)
            {
                if (tags.FirstOrDefault(_tag => _tag.Id == tag.Id) == null)
                {
                    model.Tags.Remove(tag);
                }
            }
        }

        private void AssignHistoryToModel(ICollection<ModelHistory> history, Model model)
        {
            var newHistory = new ModelHistory()
            {
                Id = Guid.NewGuid(),
                CreatedAt = model.UpdatedAt,
                CreatedBy = model.UpdatedBy,
                FileKey = model.Filekey,
            };

            _context.Entry(newHistory).State = EntityState.Added;

            model.ModelHistory.Add(newHistory);
        }

        /// <inheritdoc cref="IModelService.Create(Model, IFormFile, IFormFile)"/>
        public Model Create(Model model, string accessToken)
        {
            var creatorId = GetUserIdByAccessToken(accessToken);
            var newModel = new Model()
            {
                Id = Guid.NewGuid(),
                Filekey = model.Filekey,
                PrevBlobKey = model.PrevBlobKey,
                Name = model.Name,
                Description = model.Description,
                CreatedAt = model.CreatedAt,
                CreatedBy = creatorId,
                UpdatedBy = creatorId,
                UpdatedAt = model.UpdatedAt
            };

            AssignTagsToModel(model.Tags, newModel);
            AssignHistoryToModel(model.ModelHistory, newModel);

            var createdEntity = _context.Add(newModel);

            _context.SaveChanges();

            return createdEntity.Entity;
        }

        /// <inheritdoc cref="IModelService.Delete(Guid)"/>
        public Model Delete(Guid id)
        {
            var foundModel = _context.Models.AsNoTracking().Include(m => m.ModelHistory).FirstOrDefault(model => model.Id == id);

            if (foundModel == null)
            {
                throw new EntityNotFoundException();
            }

            var absoluteFilePath = Path.Combine(_env.WebRootPath, foundModel.Filekey);
            var absolutePreviewPath = Path.Combine(_env.WebRootPath, foundModel.PrevBlobKey);

            var deletedEntity = (Model)_context.DeleteAndSave(foundModel);

            return deletedEntity;
        }

        /// <inheritdoc cref="IModelService.ReadAll"/>
        public IEnumerable<Model> ReadAll()
        {
            return _context.Models.AsNoTracking().Include(model => model.Tags).Include(model => model.ModelHistory).ToArray();
        }

        /// <inheritdoc cref="IModelService.ReadOne(Guid)"/>
        public Model ReadOne(Guid id)
        {
            var foundModel = _context.Models.AsNoTracking().Include(model => model.Tags).Include(model => model.ModelHistory).FirstOrDefault(model => model.Id == id);

            if (foundModel == null)
            {
                throw new EntityNotFoundException();
            }

            return foundModel;
        }

        /// <inheritdoc cref="IModelService.Update(Guid, Model, IFormFile, IFormFile)"/>
        public Model Update(Guid id, Model model, string accessToken)
        {
            var foundModel = _context.Models.Include(model => model.Tags).Include(model => model.ModelHistory).FirstOrDefault(model => model.Id == id);

            if (foundModel == null)
            {
                throw new EntityNotFoundException();
            }

            foundModel.Filekey = model.Filekey;
            foundModel.PrevBlobKey = model.PrevBlobKey;
            foundModel.Name = model.Name ?? foundModel.Name;
            foundModel.Description = model.Description ?? foundModel.Description;
            foundModel.UpdatedAt = model.UpdatedAt;
            foundModel.UpdatedBy = GetUserIdByAccessToken(accessToken);

            AssignHistoryToModel(foundModel.ModelHistory, foundModel);
            AssignTagsToModel(model.Tags, foundModel);

            var updatedEntity = _context.Update(foundModel);

            _context.SaveChanges();

            return updatedEntity.Entity;
        }

        private Guid GetUserIdByAccessToken(string accessToken)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            if (token.ValidTo < DateTime.Now && token.SigningCredentials == credentials)
            {
                throw new IncorrectTokenException();
            }

            var userId = token.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            return Guid.Parse(userId);
        }
    }
}

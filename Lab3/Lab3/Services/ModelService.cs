﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Lab3.Exceptions;
using Lab3.Interfaces;
using Lab3.Models;

namespace Lab3.Services
{
    public class ModelService : IModelService
    {
        private readonly ModelContext _context;
        private readonly IFileService _fileService;
        private readonly IWebHostEnvironment env;

        public ModelService(ModelContext context, IWebHostEnvironment _env, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
            env = _env;
        }

        private void AssignTagsToModel(ICollection<Tag> tags, Model model)
        {
            foreach(var tag in tags)
            {
                var foundTag = _context.Tags.FirstOrDefault(_tag => _tag.Id == tag.Id);

                if (foundTag != null)
                {
                    model.Tags.Add(foundTag);
                }
            }
        }

        private static void AssignHistoryToModel(ICollection<ModelHistory> history, Model model)
        {
            foreach (var historyRow in history)
            {
                model.ModelHistory.Add(historyRow);
            }

            var newHistory = new ModelHistory()
            {
                Id = Guid.NewGuid(),
                CreatedAt = model.UpdatedAt,
                CreatedBy = model.UpdatedBy,
                FileKey = model.Filekey,
            };

            model.ModelHistory.Add(newHistory);
        }

        /// <inheritdoc cref="IModelService.Create(Model, IFormFile, IFormFile)"/>
        public Model Create(Model model, IFormFile file, IFormFile preview)
        {
            string filePath = null, previewPath = null;

            if (file != null)
            {
                filePath = _fileService.SaveFile(file, FileTypeEnum.File);
            }

            if (preview != null)
            {
                previewPath = _fileService.SaveFile(preview, FileTypeEnum.Preview);
            }

            var newModel = new Model()
            {
                Id = Guid.NewGuid(),
                Filekey = filePath,
                PrevBlobKey = previewPath,
                Name = model.Name,
                Description = model.Description,
                CreatedAt = model.CreatedAt,
                CreatedBy = model.CreatedBy,
                UpdatedBy = model.UpdatedBy,
                UpdatedAt = model.UpdatedAt
            };

            AssignTagsToModel(model.Tags, newModel);
            AssignHistoryToModel(model.ModelHistory, newModel);

            var createdEntity = (Model)_context.AddAndSave(newModel);

            return createdEntity;
        }

        /// <inheritdoc cref="IModelService.Delete(Guid)"/>
        public Model Delete(Guid id)
        {
            var foundModel = _context.Models.AsNoTracking().Include(m => m.ModelHistory).FirstOrDefault(model => model.Id == id);

            if (foundModel == null)
            {
                throw new EntityNotFoundException();
            }

            var absoluteFilePath = Path.Combine(env.WebRootPath, foundModel.Filekey);
            var absolutePreviewPath = Path.Combine(env.WebRootPath, foundModel.PrevBlobKey);

            _fileService.DeleteFile(absoluteFilePath);
            _fileService.DeleteFile(absolutePreviewPath);

            var deletedEntity = (Model)_context.DeleteAndSave(foundModel);

            foreach (var history in foundModel.ModelHistory)
            {
                absoluteFilePath = Path.Combine(env.WebRootPath, history.FileKey);

                _fileService.DeleteFile(absoluteFilePath);
            }

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
        public Model Update(Guid id, Model model, IFormFile file, IFormFile preview)
        {
            var foundModel = _context.Models.AsNoTracking().Include(model => model.ModelHistory).Include(model => model.Tags).FirstOrDefault(model => model.Id == id);

            if (foundModel == null)
            {
                throw new EntityNotFoundException();
            }

            if (foundModel.PrevBlobKey != null)
            {
                var absolutePreviewPath = Path.Combine(env.WebRootPath, foundModel.PrevBlobKey);

                _fileService.DeleteFile(absolutePreviewPath);
            }

            string filePath = null, previewPath = null;

            if (file != null)
            {
                filePath = _fileService.SaveFile(file, FileTypeEnum.File);
            }

            if (preview != null)
            {
                previewPath = _fileService.SaveFile(preview, FileTypeEnum.Preview);
            }

            foundModel.Filekey = filePath;
            foundModel.PrevBlobKey = previewPath;
            foundModel.Name = model.Name ?? foundModel.Name;
            foundModel.Description = model.Description ?? foundModel.Description;
            foundModel.UpdatedBy = model.UpdatedBy;
            foundModel.UpdatedAt = model.UpdatedAt;
            foundModel.Tags = new List<Tag>();

            AssignTagsToModel(model.Tags, foundModel);

            var newHistory = new ModelHistory()
            {
                Id = Guid.NewGuid(),
                CreatedAt = foundModel.UpdatedAt,
                CreatedBy = foundModel.UpdatedBy,
                FileKey = foundModel.Filekey,
            };

            _context.Entry(newHistory).State = EntityState.Added;

            foundModel.ModelHistory.Add(newHistory);

            var updatedEntity = _context.Models.Update(foundModel);

            _context.SaveChanges();

            return updatedEntity.Entity;
        }
    }
}
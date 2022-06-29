using System;
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
        private readonly IWebHostEnvironment env;
        private readonly string[] fileTypes = { "File", "Preview" };

        public ModelService(ModelContext context, IWebHostEnvironment _env)
        {
            this._context = context;
            env = _env;
        }

        private enum FileTypeEnum
        {
            file = 0,
            preview = 1
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

        private void AssignHistoryToModel(ICollection<ModelHistory> history, Model model)
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

        private void CreateDirectoryForFile(FileTypeEnum fileType)
        {
            if (env.WebRootPath == null)
            {
                var rootPath = env.ContentRootPath;
                var webRootPath = Path.Combine(rootPath, "wwwroot");

                Directory.CreateDirectory(webRootPath);

                env.WebRootPath = webRootPath;

                // Get the directory name from the array by file type as the index
                var nameOfDirectory = fileTypes[((int)fileType)];
                var absoluteDirectoryPath = Path.Combine(env.WebRootPath, nameOfDirectory);

                Directory.CreateDirectory(absoluteDirectoryPath);
            }
            else
            {
                // Get the directory name from the array by file type as the index
                var nameOfDirectory = fileTypes[((int)fileType)];
                var filePath = Path.Combine(env.WebRootPath, nameOfDirectory);

                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }
            }
        }

        private string SaveFile(IFormFile file, FileTypeEnum fileType)
        {
            CreateDirectoryForFile(fileType);

            var fileExtention = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtention}";
            // Get the directory name from the array by file type as the index
            var nameOfDirectory = fileTypes[((int)fileType)];
            var webFilePath = Path.Combine(nameOfDirectory, fileName);
            var absoluteFilePath = Path.Combine(env.WebRootPath, webFilePath);

            using var fileStream = new FileStream(absoluteFilePath, FileMode.Create);
            file.CopyTo(fileStream);

            return webFilePath;
        }

        /// <inheritdoc cref="IModelService.Create(Model, IFormFile, IFormFile)"/>
        public Model Create(Model model, IFormFile file, IFormFile preview)
        {
            string filePath = null, previewPath = null;

            if (file != null)
            {
                filePath = SaveFile(file, FileTypeEnum.file);
            }

            if (preview != null)
            {
                previewPath = SaveFile(preview, FileTypeEnum.preview);
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

            File.Delete(absoluteFilePath);
            File.Delete(absolutePreviewPath);

            var deletedEntity = (Model)_context.DeleteAndSave(foundModel);

            foreach (var history in foundModel.ModelHistory)
            {
                absoluteFilePath = Path.Combine(env.WebRootPath, history.FileKey);

                File.Delete(absoluteFilePath);
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

            var absolutePreviewPath = Path.Combine(env.WebRootPath, foundModel.PrevBlobKey);

            File.Delete(absolutePreviewPath);

            string filePath = null, previewPath = null;

            if (file != null)
            {
                filePath = SaveFile(file, FileTypeEnum.file);
            }

            if (preview != null)
            {
                previewPath = SaveFile(preview, FileTypeEnum.preview);
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

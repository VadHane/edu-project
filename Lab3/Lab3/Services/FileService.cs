using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Lab3.Models;
using Lab3.Exceptions;
using Lab3.Interfaces;

namespace Lab3.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly string[] fileTypes = { "Files", "Previews", "Images" };

        public FileService(IWebHostEnvironment environment)
        {
            _env = environment;
        }

        private void CreateDirectoryForFile(FileTypeEnum fileType)
        {
            if (_env.WebRootPath == null)
            {
                var rootPath = _env.ContentRootPath;
                var webRootPath = Path.Combine(rootPath, "wwwroot");

                Directory.CreateDirectory(webRootPath);

                _env.WebRootPath = webRootPath;

                // Get the directory name from the array by file type as the index
                var nameOfDirectory = fileTypes[((int)fileType)];
                var absoluteDirectoryPath = Path.Combine(_env.WebRootPath, nameOfDirectory);

                Directory.CreateDirectory(absoluteDirectoryPath);
            }
            else
            {
                // Get the directory name from the array by file type as the index
                var nameOfDirectory = fileTypes[((int)fileType)];
                var filePath = Path.Combine(_env.WebRootPath, nameOfDirectory);

                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }
            }
        }

        public string SaveFile(IFormFile file, FileTypeEnum fileType)
        {
            CreateDirectoryForFile(fileType);

            var fileExtention = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtention}";
            // Get the directory name from the array by file type as the index
            var nameOfDirectory = fileTypes[((int)fileType)];
            var webFilePath = Path.Combine(nameOfDirectory, fileName);
            var absoluteFilePath = Path.Combine(_env.WebRootPath, webFilePath);

            using var fileStream = new FileStream(absoluteFilePath, FileMode.Create);
            file.CopyTo(fileStream);

            return webFilePath;
        }

        public void DeleteFile(string absolutePath)
        {
            File.Delete(absolutePath);
        }
    }
}

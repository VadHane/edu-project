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
    public class UserService: IUserService
    {
        private readonly UserContext _context;

        private readonly IWebHostEnvironment _env;

        private void AssignRolesToUser(ICollection<Role> roles, User user)
        {
            foreach (var role in roles)
            {
                var foundRole = _context.Roles.FirstOrDefault(_role => _role.Id == role.Id);

                if (foundRole != null)
                {
                    user.Roles.Add(foundRole);
                }
            }
        }

        public UserService(UserContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string CreateFile(IFormFile file)
        {
            if (_env.WebRootPath == null)
            {
                string rootPath = _env.ContentRootPath;
                string webRootPath = $"{rootPath}/wwwroot";

                Directory.CreateDirectory(webRootPath);

                _env.WebRootPath = $"{rootPath}/wwwroot";

                Directory.CreateDirectory($"{_env.WebRootPath}/Images");
            }
            else
            {
                string imagesPath = $"{_env.WebRootPath}/Images";

                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }
            }

            string fileExtention = Path.GetExtension(file.FileName);
            string fileName = Guid.NewGuid() + "." + fileExtention;
            string webFilePath = $"Images/{fileName}";
            string absoluteFilePath = Path.Combine(_env.WebRootPath, webFilePath);

            using var fileStream = new FileStream(absoluteFilePath, FileMode.Create);
            file.CopyTo(fileStream);

            return webFilePath;
        }

        /// <inheritdoc cref="IUserService.ReadAll"/>
        public IEnumerable<User> ReadAll()
        {
            if (!_context.Users.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return _context.Users.AsNoTracking().Include(user => user.Roles).ToArray();
        }

        /// <inheritdoc cref="IUserService.ReadOne(Guid)"/>
        public User ReadOne(Guid id)
        {
            if (!_context.Users.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            var foundUser = _context.Users.AsNoTracking().Include(user => user.Roles).FirstOrDefault(user => user.Id == id);

            if (foundUser == null)
            {
                throw new EntityNotFoundException();
            }

            return foundUser;
        }

        /// <inheritdoc cref="IUserService.Create(User, IFormFile)"/>
        public User Create(User user, IFormFile file)
        {
            string filePath = null;

            if (file != null)
            {
                filePath = CreateFile(file);
            }

            var newUser = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                ImageBlobKey = filePath,
            };

            AssignRolesToUser(user.Roles, newUser);

            var createdEntity = (User)_context.AddAndSave(newUser);

            return createdEntity;
        }

        /// <inheritdoc cref="IUserService.Update(Guid, User, IFormFile)"/>
        public User Update(Guid id, User user, IFormFile file)
        {
            var foundUser = _context.Users.FirstOrDefault(_user => _user.Id == id);

            if (foundUser == null)
            {
                throw new EntityNotFoundException();
            }

            if (foundUser.ImageBlobKey != null && file != null)
            {
                string absoluteFilePath = $"{_env.WebRootPath}/{foundUser.ImageBlobKey}";
                File.Delete(absoluteFilePath);
            }

            if (file != null)
            {
                user.ImageBlobKey = CreateFile(file);
            }
            else
            {
                user.ImageBlobKey = null;
            }

            var updatedUser = new User()
            {
                Id = id,
                FirstName = user.FirstName ?? foundUser.FirstName,
                LastName = user.LastName ?? foundUser.LastName,
                Email = user.Email ?? foundUser.Email,
                ImageBlobKey = user.ImageBlobKey ?? foundUser.ImageBlobKey
            };

            AssignRolesToUser(user.Roles, updatedUser);

            var updatedEntity = (User)_context.UpdateAndSave(foundUser, updatedUser);

            return updatedEntity;
        }

        /// <inheritdoc cref="IUserService.Delete(Guid)"/>
        public User Delete(Guid id)
        {
            var deletedUser = _context.Users.FirstOrDefault(user => user.Id == id);

            if (deletedUser == null)
            {
                throw new EntityNotFoundException();
            }

            if (deletedUser.ImageBlobKey != null)
            {
                string absoluteFilePath = $"{_env.WebRootPath}/{deletedUser.ImageBlobKey}";
                File.Delete(absoluteFilePath);
            }

            var deletedEntity = (User)_context.DeleteAndSave(deletedUser);

            return deletedEntity;
        }
    }
}

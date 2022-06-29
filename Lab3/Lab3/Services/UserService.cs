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
        private readonly UserContext context;

        private readonly IWebHostEnvironment env;

        private void AssignRolesToUser(ICollection<Role> roles, User user)
        {
            foreach (var role in roles)
            {
                var foundRole = context.Roles.FirstOrDefault(_role => _role.Id == role.Id);

                if (foundRole != null)
                {
                    user.Roles.Add(foundRole);
                }
            }
        }

        public UserService(UserContext _context, IWebHostEnvironment _env)
        {
            context = _context;
            env = _env;
        }

        private string CreateFile(IFormFile file)
        {
            if (env.WebRootPath == null)
            {
                string rootPath = env.ContentRootPath;
                string webRootPath = $"{rootPath}/wwwroot";

                Directory.CreateDirectory(webRootPath);

                env.WebRootPath = $"{rootPath}/wwwroot";

                Directory.CreateDirectory($"{env.WebRootPath}/Images");
            }
            else
            {
                string imagesPath = $"{env.WebRootPath}/Images";

                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }
            }

            string fileExtention = Path.GetExtension(file.FileName);
            string fileName = Guid.NewGuid() + "." + fileExtention;
            string webFilePath = $"Images/{fileName}";
            string absoluteFilePath = Path.Combine(env.WebRootPath, webFilePath);

            using var fileStream = new FileStream(absoluteFilePath, FileMode.Create);
            file.CopyTo(fileStream);

            return webFilePath;
        }

        /// <inheritdoc cref="IUserService.ReadAll"/>
        public IEnumerable<User> ReadAll()
        {
            if (!context.Users.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return context.Users.AsNoTracking().Include(user => user.Roles).ToArray();
        }

        /// <inheritdoc cref="IUserService.ReadOne(Guid)"/>
        public User ReadOne(Guid id)
        {
            if (!context.Users.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            var foundUser = context.Users.AsNoTracking().Include(user => user.Roles).FirstOrDefault(user => user.Id == id);

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

            var createdEntity = (User)context.AddAndSave(newUser);

            return createdEntity;
        }

        /// <inheritdoc cref="IUserService.Update(Guid, User, IFormFile)"/>
        public User Update(Guid id, User user, IFormFile file)
        {
            var foundUser = context.Users.FirstOrDefault(_user => _user.Id == id);

            if (foundUser == null)
            {
                throw new EntityNotFoundException();
            }

            if (foundUser.ImageBlobKey != null && file != null)
            {
                string absoluteFilePath = $"{env.WebRootPath}/{foundUser.ImageBlobKey}";
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

            var updatedEntity = (User)context.UpdateAndSave(foundUser, updatedUser);

            return updatedEntity;
        }

        /// <inheritdoc cref="IUserService.Delete(Guid)"/>
        public User Delete(Guid id)
        {
            var deletedUser = context.Users.FirstOrDefault(user => user.Id == id);

            if (deletedUser == null)
            {
                throw new EntityNotFoundException();
            }

            if (deletedUser.ImageBlobKey != null)
            {
                string absoluteFilePath = $"{env.WebRootPath}/{deletedUser.ImageBlobKey}";
                File.Delete(absoluteFilePath);
            }

            var deletedEntity = (User)context.DeleteAndSave(deletedUser);

            return deletedEntity;
        }
    }
}

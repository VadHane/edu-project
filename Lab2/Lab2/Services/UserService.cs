using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Lab2.Models;
using Lab2.Exceptions;

namespace Lab2.Services
{
    public class UserService
    {
        /// <summary>
        /// The context of database.
        /// </summary>
        private readonly UserContext context;

        private readonly IWebHostEnvironment env;

        /// <summary>
        /// Assign roles to the user.
        /// </summary>
        /// <param name="roles">List of roles.</param>
        /// <param name="user">The model of user.</param>
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

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="_context">The context of database.</param>
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

        /// <summary>
        /// Return all users entity from database.
        /// </summary>
        /// <returns>Array of user entities.</returns>
        public User[] ReadAll()
        {
            if (!context.Users.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return context.Users.AsNoTracking().Include(user => user.Roles).ToArray();
        }

        /// <summary>
        /// Return the user entity from database by id.
        /// </summary>
        /// <param name="id">The unique id of user in database.</param>
        /// <returns>The entity of found user from database.</returns>
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

        /// <summary>
        /// Create new user entity in database.
        /// </summary>
        /// <param name="user">The model of user.</param>
        /// <returns>The entity of created user from database.</returns>
        public User Create(User user, IFormFile file)
        {
            string filePath;

            if (file != null)
            {
                filePath = CreateFile(file);
            }
            else
            {
                filePath = null;
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

        /// <summary>
        /// Update the user entity in database.
        /// </summary>
        /// <param name="id">The unique id of user in database.</param>
        /// <param name="user">New model of user.</param>
        /// <returns>The entity of updated user from database.</returns>
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

        /// <summary>
        /// Delete the user entity in database.
        /// </summary>
        /// <param name="id">The unique id of user in database.</param>
        /// <returns>The entity of deleted user from database.</returns>
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

﻿using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Exceptions;
using API.Interfaces;

namespace API.Services
{
    public class UserService: IUserService
    {
        private readonly UserContext _context;
        private readonly IFileService _fileService;
        private readonly IWebHostEnvironment _env;

        public UserService(UserContext context, IWebHostEnvironment env, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
            _env = env;
        }

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
                filePath = _fileService.SaveFile(file, FileTypeEnum.Image);
            }

            var newUser = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                ImageBlobKey = filePath,
                Password = EncryptionService.GetHash(user.Password),
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
                _fileService.DeleteFile(absoluteFilePath);
            }

            if (file != null)
            {
                user.ImageBlobKey = _fileService.SaveFile(file, FileTypeEnum.Image);
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
                ImageBlobKey = user.ImageBlobKey ?? foundUser.ImageBlobKey,
                Password = EncryptionService.GetHash(user.Password) ?? foundUser.Password,
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
                _fileService.DeleteFile(absoluteFilePath);
            }

            var deletedEntity = (User)_context.DeleteAndSave(deletedUser);

            return deletedEntity;
        }
    }
}

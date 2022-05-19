using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2.Models;

namespace Lab2.Services
{
    public class UserService
    {
        public UserService(UserContext _context)
        {
            context = _context;
        }

        public UserContext context { get; set; }


        public User[] ReadAll()
        {
            if (!context.Users.Any())
            {
                throw new Exception(Constants.DATABASE_IS_EMPTY_TEXT);
            }

            return context.Users.ToArray();
        }

        public User Create(User user)
        {
            User newUser = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                ImageBlobKey = user.ImageBlobKey,
            };

            // question
            foreach (Role role in user.Roles)
            {
                Role foundRole = context.Roles.Where(_role => _role.Id == role.Id).First();

                if (foundRole != null)
                {
                    newUser.Roles.Add(foundRole);
                }
            }

            User createdEntity = context.Add(newUser).Entity;
            context.SaveChanges();

            return createdEntity;
        }

        public User Update(Guid id, User user)
        {
            User foundUser = context.Users.Where(_user => _user.Id == id).First();

            if (foundUser == null)
            {
                throw new Exception(Constants.NOT_FOUND_EXCEPTION);
            }

            User updatedUser = new User()
            {
                Id = id,
                FirstName = user.FirstName ?? foundUser.FirstName,
                LastName = user.LastName ?? foundUser.LastName,
                Email = user.Email ?? foundUser.Email,
                ImageBlobKey = user.ImageBlobKey ?? foundUser.ImageBlobKey
            };

            foreach (Role role in user.Roles)
            {
                Role foundRole = context.Roles.Where(_role => _role.Id == role.Id).First();

                if (foundRole != null)
                {
                    updatedUser.Roles.Add(foundRole);
                }
            }

            User updatedEntity = context.Users.Update(user).Entity;
            context.SaveChanges();

            return updatedEntity;
        }


        public User Delete(Guid id)
        {
            User deletedEntity = context.Users.Where(user => user.Id == id).First();

            if (deletedEntity == null)
            {
                throw new Exception(Constants.NOT_FOUND_EXCEPTION);
            }

            context.Users.Remove(deletedEntity);
            context.SaveChanges();

            return deletedEntity;
        }
    }
}

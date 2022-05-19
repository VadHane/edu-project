using System;
using System.Linq;
using Lab2.Models;

namespace Lab2.Services
{
    public class UserService
    {
        /// <summary>
        /// The context of database.
        /// </summary>
        private readonly UserContext context;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="_context">The context of database.</param>
        public UserService(UserContext _context)
        {
            context = _context;
        }

        /// <summary>
        /// Return all users entity from database.
        /// </summary>
        /// <returns>Array of user entities.</returns>
        public User[] ReadAll()
        {
            if (!context.Users.Any())
            {
                throw new Exception(Constants.DATABASE_IS_EMPTY_TEXT);
            }

            return context.Users.ToArray();
        }

        /// <summary>
        /// Create new user entity in database.
        /// </summary>
        /// <param name="user">The model of user.</param>
        /// <returns>The entity of created user from database.</returns>
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

        /// <summary>
        /// Update the user entity in database.
        /// </summary>
        /// <param name="id">The unique id of user in database.</param>
        /// <param name="user">New model of user.</param>
        /// <returns>The entity of updated user from database.</returns>
        public User Update(Guid id, User user)
        {
            User foundUser = context.Users.FirstOrDefault(_user => _user.Id == id);

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

        /// <summary>
        /// Delete the user entity in database.
        /// </summary>
        /// <param name="id">The unique id of user in database.</param>
        /// <returns>The entity of deleted user from database.</returns>
        public User Delete(Guid id)
        {
            User deletedEntity = context.Users.FirstOrDefault(user => user.Id == id);

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

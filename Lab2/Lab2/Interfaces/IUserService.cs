using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Lab2.Models;

namespace Lab2.Services
{
    public interface IUserService
    {
        /// <summary>
        /// Return all users entity from the database.
        /// </summary>
        /// <returns>The array of user entities.</returns>
        IEnumerable<User> ReadAll();

        /// <summary>
        /// Return the user entity from the database by id.
        /// </summary>
        /// <param name="id">The unique id of the user in the database.</param>
        /// <returns>The entity of found user from the database.</returns>
        User ReadOne(Guid id);

        /// <summary>
        /// Create a new user entity in the database.
        /// </summary>
        /// <param name="user">The instance of the user.</param>
        /// <param name="file">The instance of the file from the request body.</param>
        /// <returns>The entity of created user from the database.</returns>
        User Create(User user, IFormFile file);

        /// <summary>
        /// Update the user entity in the database.
        /// </summary>
        /// <param name="id">The unique id of the user in the database.</param>
        /// <param name="user">The instance of the user.</param>
        /// <param name="file">The instance of the file from the request body.</param>
        /// <returns>The entity of updated user from the database.</returns>
        User Update(Guid id, User user, IFormFile file);

        /// <summary>
        /// Delete the user entity in the database.
        /// </summary>
        /// <param name="id">The unique id of the user in the database.</param>
        /// <returns>The entity of deleted user from the database.</returns>
        User Delete(Guid id);
    }
}

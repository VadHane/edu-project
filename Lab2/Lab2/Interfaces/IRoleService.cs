using System;
using System.Collections.Generic;
using Lab2.Models;

namespace Lab2.Services
{
    public interface IRoleService
    {
        /// <summary>
        /// Return all roles entity from the database.
        /// </summary>
        /// <returns>The array of role entities.</returns>
        IEnumerable<Role> ReadAll();

        /// <summary>
        /// Return the role entity from the database by id.
        /// </summary>
        /// <param name="id">The unique id of role in the database.</param>
        /// <returns>The entity of found role from the database.</returns>
        Role ReadOne(Guid id);

        /// <summary>
        ///  Create a new role entity in the database.
        /// </summary>
        /// <param name="role">The instance of the role.</param>
        /// <returns>The entity of created role from the database.</returns>
        Role Create(Role role);
    }
}

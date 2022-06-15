using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Lab2.Exceptions;
using Lab2.Models;

namespace Lab2.Services
{
    public class RoleService
    {
        /// <summary>
        /// The context of database.
        /// </summary>
        private readonly UserContext context;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="_context">The context of database.</param>
        public RoleService(UserContext _context)
        {
            context = _context;
        }

        /// <summary>
        /// Return all roles entity from database.
        /// </summary>
        /// <returns>Array of role entities.</returns>
        public Role[] ReadAll()
        {
            if (!context.Roles.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return context.Roles.AsNoTracking().Include(role => role.Users).ToArray();
        }

        /// <summary>
        /// Return the role entity from database by id.
        /// </summary>
        /// <param name="id">The unique id of role in database.</param>
        /// <returns>The entity of found role from database.</returns>
        public Role ReadOne(Guid id)
        {
            if (!context.Roles.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            var foundRole = context.Roles.AsNoTracking().Include(role => role.Users).FirstOrDefault(role => role.Id == id);

            if (foundRole == null)
            {
                throw new EntityNotFoundException();
            }

            return foundRole;
        }

        /// <summary>
        /// Create new role entity in database.
        /// </summary>
        /// <param name="role">The model of role.</param>
        /// <returns>The entity of created role from database.</returns>
        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();

            var createdEntity = (Role)context.AddAndSave(role);

            return createdEntity;
        }
    }
}

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
        /// Create new role entity in database.
        /// </summary>
        /// <param name="role">The model of role.</param>
        /// <returns>The entity of created role from database.</returns>
        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();

            Role createdEntity = (Role)context.AddAndSave(role);

            return createdEntity;
        }
    }
}

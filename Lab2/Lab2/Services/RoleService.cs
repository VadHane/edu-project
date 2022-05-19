using System;
using System.Linq;
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
                throw new Exception(Constants.DATABASE_IS_EMPTY_TEXT);
            }

            return context.Roles.ToArray();
        }

        /// <summary>
        /// Create new role entity in database.
        /// </summary>
        /// <param name="role">The model of role.</param>
        /// <returns>The entity of created role from database.</returns>
        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();

            Role createdEntity = context.Add(role).Entity;
            context.SaveChanges();

            return createdEntity;
        }
    }
}

using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using API.Exceptions;
using API.Models;
using API.Interfaces;

namespace API.Services
{
    public class RoleService : IRoleService
    {
        private readonly UserContext _context;

        public RoleService(UserContext context)
        {
            _context = context;
        }

        /// <inheritdoc cref="IRoleService.ReadAll"/>
        public IEnumerable<Role> ReadAll()
        {
            if (!_context.Roles.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return _context.Roles.AsNoTracking().ToArray();
        }

        /// <inheritdoc cref="IRoleService.ReadOne"/>
        public Role ReadOne(Guid id)
        {
            if (!_context.Roles.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            var foundRole = _context.Roles.AsNoTracking().Include(role => role.Users).FirstOrDefault(role => role.Id == id);

            if (foundRole == null)
            {
                throw new EntityNotFoundException();
            }

            return foundRole;
        }

        /// <inheritdoc cref="IRoleService.Create(Role)"/>
        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();

            var createdEntity = (Role)_context.AddAndSave(role);

            return createdEntity;
        }
    }
}

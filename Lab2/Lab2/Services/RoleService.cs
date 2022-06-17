using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Lab2.Exceptions;
using Lab2.Models;

namespace Lab2.Services
{
    public class RoleService : IRoleService
    {
        private readonly UserContext context;

        public RoleService(UserContext _context)
        {
            context = _context;
        }

        public IEnumerable<Role> ReadAll()
        {
            if (!context.Roles.Any())
            {
                throw new DatabaseIsEmptyException();
            }

            return context.Roles.AsNoTracking().Include(role => role.Users).ToArray();
        }

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

        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();

            var createdEntity = (Role)context.AddAndSave(role);

            return createdEntity;
        }
    }
}

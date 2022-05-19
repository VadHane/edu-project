using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2.Models;

namespace Lab2.Services
{
    public class RoleService
    { 
        public UserContext context { get; set; }

        public RoleService(UserContext _context)
        {
            context = _context;
        }

        public Role[] ReadAll()
        {
            if (!context.Roles.Any())
            {
                throw new Exception(Constants.DATABASE_IS_EMPTY_TEXT);
            }

            return context.Roles.ToArray();
        }

        public Role Create(Role role)
        {
            role.Id = Guid.NewGuid();
            Role newRoleEntity = context.Add(role).Entity;
            
            context.SaveChanges();

            return newRoleEntity;
        }
    }
}

using Lab2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab2.Services
{
    public interface IRoleService
    {
        Role[] ReadAll();

        Role ReadOne(Guid id);

        Role Create(Role role);
    }
}

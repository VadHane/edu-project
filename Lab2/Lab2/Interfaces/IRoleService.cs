using System;
using System.Collections.Generic;
using Lab2.Models;

namespace Lab2.Services
{
    public interface IRoleService
    {
        IEnumerable<Role> ReadAll();

        Role ReadOne(Guid id);

        Role Create(Role role);
    }
}

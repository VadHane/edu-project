using Lab2.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Lab2.Services
{
    public interface IUserService
    {
        User[] ReadAll();

        User ReadOne(Guid id);

        User Create(User user, IFormFile file);

        User Update(Guid id, User user, IFormFile file);

        User Delete(Guid id);
    }
}

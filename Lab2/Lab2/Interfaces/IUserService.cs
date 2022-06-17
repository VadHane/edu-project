using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Lab2.Models;

namespace Lab2.Services
{
    public interface IUserService
    {
        IEnumerable<User> ReadAll();

        User ReadOne(Guid id);

        User Create(User user, IFormFile file);

        User Update(Guid id, User user, IFormFile file);

        User Delete(Guid id);
    }
}

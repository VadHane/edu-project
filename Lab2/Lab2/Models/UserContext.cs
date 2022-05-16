using Microsoft.EntityFrameworkCore;
using System;

namespace Lab2.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions contextOptions) : base(contextOptions) { }


        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Role>().HasData(
                new Role() { Id = Guid.NewGuid(), Name = "Super Admin" },
                new Role() { Id = Guid.NewGuid(), Name = "Admin" }
            );

        }
    }
}

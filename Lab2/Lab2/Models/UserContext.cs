using System;
using Microsoft.EntityFrameworkCore;


namespace Lab2.Models
{
    /// <summary>
    /// Context of 'Users' database.
    /// </summary>
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

        public Object AddAndSave(Object entity)
        {
            var createdEntity = this.Add(entity).Entity;

            this.SaveChanges();

            return createdEntity;
        }

        public Object UpdateAndSave(Object entity)
        {
            var updatedEntity = this.Update(entity).Entity;

            this.SaveChanges();

            return updatedEntity;
        }

        public Object DeleteAndSave(Object entity)
        {
            var deleteEntity = this.Remove(entity).Entity;

            this.SaveChanges();

            return deleteEntity;
        }
    }
}

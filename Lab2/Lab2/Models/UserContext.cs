using System;
using Microsoft.EntityFrameworkCore;


namespace Lab2.Models
{
    /// <summary>
    /// Context of 'Users' database.
    /// </summary>
    public class UserContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public UserContext(DbContextOptions contextOptions) : base(contextOptions) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Role>().HasData(
                new Role() { Id = Guid.NewGuid(), Name = "Super Admin" },
                new Role() { Id = Guid.NewGuid(), Name = "Admin" }
            );

        }

        public object AddAndSave(object entity)
        {
            var createdEntity = Add(entity).Entity;

            SaveChanges();

            return createdEntity;
        }

        public object UpdateAndSave(object entity, object updEntity)
        {
            Entry(entity).CurrentValues.SetValues(updEntity);

            SaveChanges();

            return Entry(updEntity).Entity;
        }

        public object DeleteAndSave(object entity)
        {
            var deleteEntity = Remove(entity).Entity;

            SaveChanges();

            return deleteEntity;
        }
    }
}

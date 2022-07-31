using System;
using Microsoft.EntityFrameworkCore;

namespace Lab3.Models
{
    public class UserContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public UserContext(DbContextOptions<UserContext> contextOptions) : base(contextOptions) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Role>().HasData(
                new Role() { Id = Guid.NewGuid(), Name = "Super Admin", IsAdmin = true },
                new Role() { Id = Guid.NewGuid(), Name = "Admin", IsAdmin = true }
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

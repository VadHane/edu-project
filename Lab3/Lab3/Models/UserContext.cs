using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Lab3.Services;

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

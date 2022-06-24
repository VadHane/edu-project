using Microsoft.EntityFrameworkCore;

namespace Lab3.Models
{
    public class ModelContext : DbContext
    {
        public DbSet<Tag> Tags { get; set; }

        public DbSet<Model> Models { get; set; }

        public DbSet<ModelHistory> ModelHistories { get; set; }

        public ModelContext(DbContextOptions options) : base(options) { }

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

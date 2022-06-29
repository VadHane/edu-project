using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Lab3.Exceptions;
using Lab3.Interfaces;
using Lab3.Models;

namespace Lab3.Services
{
    public class TagService : ITagService
    {
        private readonly ModelContext context;

        public TagService(ModelContext _context)
        {
            context = _context;
        }

        /// <inheritdoc cref="ITagService.Create(Tag)"/>
        public Tag Create(Tag tag)
        {
            tag.Id = Guid.NewGuid();

            var createdEntity = (Tag)context.AddAndSave(tag);

            return createdEntity;
        }

        /// <inheritdoc cref="ITagService.ReadAll"/>
        public IEnumerable<Tag> ReadAll()
        {
            return context.Tags.AsNoTracking().Include(tag => tag.Models).ToArray();
        }

        /// <inheritdoc cref="ITagService.ReadOne(Guid)"/>
        public Tag ReadOne(Guid id)
        {
            var foundTag = context.Tags.AsNoTracking().Include(tag => tag.Models).FirstOrDefault(tag => tag.Id == id);

            if (foundTag == null)
            {
                throw new EntityNotFoundException();
            }

            return foundTag;
        }
    }
}

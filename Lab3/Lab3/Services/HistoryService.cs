using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Lab3.Interfaces;
using Lab3.Models;
using Lab3.Exceptions;

namespace Lab3.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly ModelContext _context;

        public HistoryService(ModelContext context)
        {
            _context = context;
        }

        /// <inheritdoc cref="IHistoryService.ReadAll(Guid)"/>
        public IEnumerable<ModelHistory> ReadAll(Guid modelId)
        {
            if (_context.Models.Where(model => modelId == model.Id) != null)
            {
                throw new EntityNotFoundException();
            }

            return _context.ModelHistories.AsNoTracking().Where(history => history.Model.Id == modelId).ToArray();
        }
    }
}

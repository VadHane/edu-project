using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using API.Models;
using API.Exceptions;

namespace API.Services
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

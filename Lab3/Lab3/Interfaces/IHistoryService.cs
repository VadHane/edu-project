using System;
using System.Collections.Generic;
using Lab3.Models;

namespace Lab3.Interfaces
{
    public interface IHistoryService
    {
        /// <summary>
        /// Return all model's history entity from the database.
        /// </summary>
        /// <returns>The array of model's history entities.</returns>
        IEnumerable<ModelHistory> ReadAll(Guid modelId);
    }
}

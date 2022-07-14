using System;
using System.Collections.Generic;
using Lab3.Models;

namespace Lab3.Interfaces
{
    public interface IModelService
    {
        /// <summary>
        /// Return all models entity from the database.
        /// </summary>
        /// <returns>The array of model entities.</returns>
        IEnumerable<Model> ReadAll();

        /// <summary>
        /// Return the model entity from the database by id.
        /// </summary>
        /// <param name="id">The unique id of the model in the database.</param>
        /// <returns>The entity of found model from the database.</returns>
        Model ReadOne(Guid id);

        /// <summary>
        /// Create a new model entity in the database.
        /// </summary>
        /// <param name="model">The instance of the model.</param>
        /// <returns>The entity of created model from the database.</returns>
        Model Create(Model model);

        /// <summary>
        /// Update the model entity in the database.
        /// </summary>
        /// <param name="id">The unique id of the model in the database.</param>
        /// <param name="model">The instance of the model.</param>
        /// <returns>The entity of updated model from the database.</returns>
        Model Update(Guid id, Model model);

        /// <summary>
        /// Delete the model entity in the database.
        /// </summary>
        /// <param name="id">The unique id of the model in the database.</param>
        /// <returns>The entity of deleted model from the database.</returns>
        Model Delete(Guid id);
    }
}

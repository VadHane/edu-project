using System;
using System.Collections.Generic;
using Lab3.Models;

namespace Lab3.Interfaces
{
    public interface ITagService
    {
        /// <summary>
        /// Return all tags entity from the database.
        /// </summary>
        /// <returns>The array of tag entities.</returns>
        IEnumerable<Tag> ReadAll();

        /// <summary>
        /// Return the tag entity from the database by id.
        /// </summary>
        /// <param name="id">The unique id of tag in the database.</param>
        /// <returns>The entity of found tag from the database.</returns>
        Tag ReadOne(Guid id);

        /// <summary>
        ///  Create a new tag entity in the database.
        /// </summary>
        /// <param name="tag">The instance of the tag.</param>
        /// <returns>The entity of created tag from the database.</returns>
        Tag Create(Tag tag);
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2.Models
{
    /// <summary>
    /// Entity for database as abstract model of role.
    /// </summary>
    public class Role
    {
        /// <summary>
        /// Unique id for role.
        /// </summary>
        public Guid Id { get; set; }
        
        /// <summary>
        /// Name of role. Max length = 20 symbols.
        /// </summary>
        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// Collections of users, which have this role.
        /// </summary>
        public virtual ICollection<User> Users { get; set; }

        /// <summary>
        /// Default constructor, which initialize collection of users.
        /// </summary>
        public Role()
        {
            Users = new List<User>();
        }
    }
}

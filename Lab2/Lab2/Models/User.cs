using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2.Models
{
    /// <summary>
    /// Entity for database as abstract model of role.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Unique id for user.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Email of user. Required for each user. Max length = 30 symbols.
        /// </summary>
        [Required]
        [MaxLength(30)]
        public string Email { get; set; }

        /// <summary>
        /// Name of user. Required for each user. Max length = 15 symbols.
        /// </summary>
        [Required]
        [MaxLength(15)]
        public string FirstName { get; set; }

        /// <summary>
        /// Surname of user. Max length = 20 symbols.
        /// </summary>
        [MaxLength(20)]
        public string LastName { get; set; }

        /// <summary>
        /// Blob key of image.
        /// </summary>
        public string ImageBlobKey { get; set; }

        /// <summary>
        /// Collection of roles of user.
        /// </summary>
        public virtual ICollection<Role> Roles { get; set; }

        /// <summary>
        /// Default constructor, which initialize collection of roles.
        /// </summary>
        public User()
        {
            Roles = new List<Role>();
        }
    }
}

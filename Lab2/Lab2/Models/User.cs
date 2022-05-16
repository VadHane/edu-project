using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2.Models
{
    public class User
    {
        public User()
        {
            Roles = new List<Role>();
        }

        public Guid Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Email { get; set; }

        [Required]
        [MaxLength(15)]
        public string FirstName { get; set; }

        [MaxLength(20)]
        public string LastName { get; set; }
        public string ImageBlobKey { get; set; }


        public virtual ICollection<Role> Roles { get; set; }
    }
}

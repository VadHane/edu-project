using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2.Models
{
    public class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        public Role(Guid id)
        {
            Id = id;
            Users = new HashSet<User>();
        }

        public Guid Id { get; set; }

        
        [MaxLength(20)]
        public string Name { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}

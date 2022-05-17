using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2.Models
{
    public class Role
    {
        public virtual ICollection<User> Users { get; set; }

        public Role()
        {
            Users = new List<User>();
        }

        public Guid Id { get; set; }
        
        [MaxLength(20)]
        public string Name { get; set; }
    }
}

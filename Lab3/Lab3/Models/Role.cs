﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab3.Models
{
    public class Role
    {
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        public virtual ICollection<User> Users { get; set; }

        public Role()
        {
            Users = new List<User>();
        }
    }
}
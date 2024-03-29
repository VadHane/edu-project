﻿using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ModelHistory
    {
        public Guid Id { get; set; }

        public string FileKey { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        public Guid ModelId { get; set; }

        public Model Model { get; set; }
    }
}

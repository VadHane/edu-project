using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Lab3.Models
{
    [Keyless]
    public class ModelHistory
    {
        public string FileKey { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        public Guid ModelId { get; set; }
        public Model Model { get; set; }
    }
}

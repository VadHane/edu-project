using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab3.Models
{
    public class Model
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        public string Filekey { get; set; }

        public string PrevBlobKey { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Guid UpdatedBy { get; set; }

        public virtual ICollection<Tag> Tags { get; set; }

        public virtual ICollection<ModelHistory> ModelHistory { get; set; }

        public Model()
        {
            Tags = new List<Tag>();
            ModelHistory = new List<ModelHistory>();
        }
    }
}

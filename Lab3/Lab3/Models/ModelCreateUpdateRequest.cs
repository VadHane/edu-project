﻿using System;

namespace Lab3.Models
{
    public class ModelCreateUpdateRequest
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public Guid CreatedBy { get; set; }

        public Guid UpdatedBy { get; set; }

        // JSON
        public string Tags { get; set; }
    }
}
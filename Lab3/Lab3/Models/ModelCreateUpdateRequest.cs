using System;

namespace Lab3.Models
{
    public class ModelCreateUpdateRequest
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Filekey { get; set; }

        public string PrevBlobKey { get; set; }

        // JSON
        public string Tags { get; set; }
    }
}

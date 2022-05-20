using System;

namespace Lab2.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException() : base("Not Found")
        {
        }

        public EntityNotFoundException(string message) : base(message)
        {
        }
    }
}

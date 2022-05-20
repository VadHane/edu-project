using System;

namespace Lab2.Exceptions
{
    public class DatabaseIsEmptyException : Exception
    {
        public DatabaseIsEmptyException() : base("Database is empty")
        {
        }

        public DatabaseIsEmptyException(string message) : base(message)
        {
        }
    }
}

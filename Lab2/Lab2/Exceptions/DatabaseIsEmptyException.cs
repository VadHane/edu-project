using System;

namespace Lab2.Exceptions
{
    [Serializable]
    public class DatabaseIsEmptyException : Exception
    {
        public DatabaseIsEmptyException() { }
        public DatabaseIsEmptyException(string message) : base(message) { }
        public DatabaseIsEmptyException(string message, Exception inner) : base(message, inner) { }
        protected DatabaseIsEmptyException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}

using System;

namespace Lab3.Exceptions
{
    [Serializable]
    public class IncorrectTokenException : Exception
    {
        public IncorrectTokenException() { }
        public IncorrectTokenException(string message) : base(message) { }
        public IncorrectTokenException(string message, Exception inner) : base(message, inner) { }
        protected IncorrectTokenException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}

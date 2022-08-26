using System.Text;

namespace API.Services
{
    public static class EncryptionService
    {
        public static string GetHash(string data)
        {
            var bytes = Encoding.UTF8.GetBytes(data);
            using var hash = System.Security.Cryptography.SHA512.Create();
            var hashedInputBytes = hash.ComputeHash(bytes);
            var hashedInputStringBuilder = new StringBuilder(128);

            foreach (var _byte in hashedInputBytes)
            {
                hashedInputStringBuilder.Append(_byte.ToString("X2"));
            }

            return hashedInputStringBuilder.ToString();
        }
    }
}

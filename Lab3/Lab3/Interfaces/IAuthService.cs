using System.Threading.Tasks;
using Lab3.Models;

namespace Lab3.Interfaces
{
    public interface IAuthService
    {
        LoginResponse Login(UserLogin userLogin);

        string RefreshJWTToken(string refreshToken);

        Task<string> SignUrl(string url);
    }
}

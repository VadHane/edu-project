using System.Threading.Tasks;
using API.Models;

namespace API.Interfaces
{
    public interface IAuthService
    {
        LoginResponse Login(UserLogin userLogin);

        LoginResponse RefreshJWTToken(string refreshToken);

        Task<string> SignUrl(string url);

        User LoginByAccessToken(string accessToken);
    }
}

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Lab3.Interfaces;
using Lab3.Models;
using Lab3.Exceptions;

namespace Lab3.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly UserContext _context;

        public AuthService(IConfiguration config, UserContext context)
        {
            _config = config;
            _context = context;
        }

        public LoginResponse Login(UserLogin userLogin)
        {
            var user = Authenticate(userLogin);

            if (user == null)
            {
                throw new EntityNotFoundException();
            }

            var expiresAccessToken = DateTime.Now.AddMinutes(Convert.ToInt32(_config["Jwt:ExpiresAccessToken"]));
            var expiresRefreshToken = DateTime.Now.AddDays(Convert.ToInt32(_config["Jwt:ExpiresRefreshToken"]));

            var loginResponse = new LoginResponse()
            {
                UserId = user.Id,
                AccessToken = GenerateJWTToken(user, expiresAccessToken),
                RefreshToken = GenerateJWTToken(user, expiresRefreshToken),
            };

            return loginResponse;
        }

        public string RefreshJWTToken(string refreshToken)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(refreshToken);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            if (token.ValidTo < DateTime.Now && token.SigningCredentials == credentials)
            {
                throw new IncorrectTokenException();
            }

            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expiresAccessToken = DateTime.Now.AddMinutes(Convert.ToInt32(_config["Jwt:ExpiresAccessToken"]));

            var accessToken = new JwtSecurityToken(issuer, audience, token.Claims, expires: expiresAccessToken, signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(accessToken);
        }

        private string GenerateJWTToken(User user, DateTime expires)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var role = IsAdmin(user) ? "Admin" : "User";
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role),
            };

            var token = new JwtSecurityToken(issuer, audience, claims, expires: expires, signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User Authenticate(UserLogin userLogin)
        {
            var foundUser = _context.Users.FirstOrDefault(user => user.Email.ToLower() == userLogin.Email.ToLower() && user.Password == userLogin.Password);

            return foundUser;
        }

        private static bool IsAdmin(User user)
        {
            foreach (var role in user.Roles)
            {
                if (role.isAdmin)
                {
                    return true;
                }
            }

            return false;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Lab3.Interfaces;
using Lab3.Models;
using Lab3.Exceptions;

namespace Lab3.Controllers
{
    [Route("api/auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("get-token")]
        public IActionResult Login([FromForm] UserLogin userLogin)
        {
            try
            {
                var loginResponse = _authService.Login(userLogin);

                return Ok(loginResponse);
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            } 
            catch
            {
                return StatusCode(500);
            }
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public IActionResult Refresh([FromForm] string refreshToken)
        {
            try
            {
                var accessToken = _authService.RefreshJWTToken(refreshToken);

                return Ok(accessToken);
            }
            catch (IncorrectTokenException)
            {
                return StatusCode(401);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [AllowAnonymous]
        [HttpPost("sign-file-storage-url")]
        public IActionResult SingUrl([FromForm] string url)
        {
            try
            {
                var signedUrl = _authService.SingUrl(url).Result;

                return Ok(signedUrl);
            }
            catch (System.Exception)
            {

                throw;
            }
        }
    }
}

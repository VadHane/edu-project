using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.Models;
using API.Exceptions;


namespace API.Controllers
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
                return StatusCode(401);
            } 
            catch
            {
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpPost("auth-by-token")]
        public IActionResult Login([FromForm] string accessToken)
        {
            try
            {
                var user = _authService.LoginByAccessToken(accessToken);

                return Ok(user);
            }
            catch (Exception ex) when (ex is IncorrectTokenException || ex is ArgumentException)
            {
                return StatusCode(401);
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
            catch (Exception ex) when (ex is IncorrectTokenException || ex is ArgumentException)
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
        public IActionResult SignUrl([FromForm] string url)
        {
            try
            {
                var signedUrl = _authService.SignUrl(url).Result;

                return Ok(signedUrl);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}

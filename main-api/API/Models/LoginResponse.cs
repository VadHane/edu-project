﻿using System;

namespace API.Models
{
    public class LoginResponse
    {
        public Guid UserId { get; set; }

        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }
}

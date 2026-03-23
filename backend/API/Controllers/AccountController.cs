using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")] // api/account/register
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            //if (await EmailExists(registerDTO.Email)) return BadRequest("Email is already taken");

            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Email,
                Member = new Member
                {
                    DisplayName = registerDTO.DisplayName,
                    Gender = registerDTO.Gender,
                    City = registerDTO.City,
                    Country = registerDTO.Country,
                    DateOfBirth = registerDTO.DateOfBirth
                }
            };

            var result = await userManager.CreateAsync(user, registerDTO.Password);

            if(!result.Succeeded)
            {
                foreach (var item in result.Errors)
                {
                    ModelState.AddModelError("identity", item.Description);
                }

                return ValidationProblem();
            }

            await userManager.AddToRoleAsync(user, "Member");

            await SetRefreshTokenCookie(user);

            return await user.ToDTO(tokenService);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO) 
        {
            if (string.IsNullOrEmpty(loginDTO.Email) || string.IsNullOrEmpty(loginDTO.Password)) 
                return BadRequest("Email and Password are required");

            var user = await userManager.FindByEmailAsync(loginDTO.Email);

            if (user is null) return Unauthorized("Invalid email address");

            var result = await userManager.CheckPasswordAsync(user, loginDTO.Password);

            if (!result) return Unauthorized("Invalid password");

            await SetRefreshTokenCookie(user);

            return await user.ToDTO(tokenService);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-secret")]
        public ActionResult<string> GetSecretAdmin()
        {
            return Ok("only admins should see this");
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDTO>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (refreshToken is null) return NoContent();

            var user = await userManager.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken
                && x.RefreshTokenExpiry > DateTime.UtcNow);

            if (user is null) return Unauthorized();

            await SetRefreshTokenCookie(user);

            return await user.ToDTO(tokenService);
        }

        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // será enviado somente como HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}

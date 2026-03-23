using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions
{
    public static class UserExtensions
    {
        public static async Task<UserDTO> ToDTO(this AppUser user, ITokenService tokenService)
        {
            return new UserDTO
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email!,
                ImgUrl = user.ImageUrl,
                Token = await tokenService.CreateToken(user)
            };
        }
    }
}

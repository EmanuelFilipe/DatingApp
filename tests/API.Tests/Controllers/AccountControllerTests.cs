using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace API.Tests.Controllers
{
    public class AccountControllerTests
    {
        private readonly Mock<ITokenService> _mockTokenService;

        public AccountControllerTests()
        {
            _mockTokenService = new Mock<ITokenService>();
        }

        private AccountController CreateController(AppDbContext context)
        {
            return new AccountController(null, _mockTokenService.Object);
        }

        [Fact]
        public void Register_Should_Create_User_When_Data_Is_Valid()
        {
            var context = DbContextHelper.CreateContext("Register_Success");
            var controller = CreateController(context);

            var registerDTO = new RegisterDTO
            {
                DisplayName = "Filipe",
                Email = "filipe@email.com",
                Password = "1234"
            };

            //_mockTokenService.Setup(x => x.CreateToken(It.IsAny<AppUser>()))
            //    .Returns("mocked_token");

            var result = controller.Register(registerDTO).Result;

            result.Result.Should().BeNull();
            result.Value.Should().NotBeNull();
            result.Value!.Email.Should().Be(registerDTO.Email);

            context.Users.Count().Should().Be(1);
        }

    }
}

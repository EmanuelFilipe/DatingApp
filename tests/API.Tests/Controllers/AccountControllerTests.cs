using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Tests.Helpers;
using API.Tests.Integration;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace API.Tests.Controllers
{
    public class AccountControllerTests : IClassFixture<ApiWebApplicationFactory>
    {
        //private readonly Mock<ITokenService> _mockTokenService;

        public AccountControllerTests()
        {
            //_mockTokenService = new Mock<ITokenService>();
        }

        //private AccountController CreateController(AppDbContext context)
        //{
        //    return new AccountController(null, _mockTokenService.Object);
        //}

        [Fact]
        public async Task Register_Should_Create_User_When_Data_Is_Valid()
        {
            //Arrange 
            var userManagerMock = GetUserMAnagerMock();
            var tokenServiceMock = new Mock<ITokenService>();
            var envMock = new Mock<IWebHostEnvironment>();

            envMock.Setup(e => e.EnvironmentName).Returns("Testing");

            var controller = new AccountController(userManagerMock.Object, tokenServiceMock.Object, envMock.Object);

            var registerDTO = new RegisterDTO
            {
                DisplayName = "Filipe",
                Email = "filipe@email.com",
                Password = "1234",
                Gender = "Male",
                City = "BH",
                Country = "Brazil",
                DateOfBirth = new DateOnly(1990, 1, 1)
            };

            tokenServiceMock
                .Setup(x => x.CreateToken(It.IsAny<AppUser>()))
                .ReturnsAsync("mocked_token");

            tokenServiceMock
                .Setup(x => x.GenerateRefreshToken())
                .Returns("mocked_refresh_token");

            userManagerMock
                .Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            userManagerMock
                .Setup(x => x.AddToRoleAsync(It.IsAny<AppUser>(), "Member"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await controller.Register(registerDTO);

            // Assert
            result.Result.Should().BeNull();
            result.Value.Should().NotBeNull();
            result.Value!.Email.Should().Be(registerDTO.Email);
        }

        // USING REPOSITORY PATTERN
        //private AccountController CreateController(AppDbContext context)
        //{
        //    return new AccountController(context, _mockTokenService.Object);
        //}

        //[Fact]
        //public void Register_Should_Create_User_When_Data_Is_Valid()
        //{
        //    var context = DbContextHelper.CreateContext("Register_Success");
        //    var controller = CreateController(context);

        //    var registerDTO = new RegisterDTO
        //    {
        //        DisplayName = "Filipe",
        //        Email = "filipe@email.com",
        //        Password = "1234"
        //    };

        //    _mockTokenService.Setup(x => x.CreateToken(It.IsAny<AppUser>()))
        //        .Returns("mocked_token");

        //    var result = controller.Register(registerDTO).Result;

        //    result.Result.Should().BeNull();
        //    result.Value.Should().NotBeNull();
        //    result.Value!.Email.Should().Be(registerDTO.Email);

        //    context.Users.Count().Should().Be(1);
        //}

        private Mock<UserManager<AppUser>> GetUserMAnagerMock()
        {
            var store = new Mock<IUserStore<AppUser>>();

            return new Mock<UserManager<AppUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

    }
}

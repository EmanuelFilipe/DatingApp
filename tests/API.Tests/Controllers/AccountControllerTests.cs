using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Tests.Fakes;
using API.Tests.Helpers;
using API.Tests.Integration;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Net;
using System.Net.Http.Json;

namespace API.Tests.Controllers
{
    public class AccountControllerTests : IClassFixture<ApiWebApplicationFactory>
    {
        //private readonly Mock<ITokenService> _mockTokenService;
        private readonly HttpClient _client;

        public AccountControllerTests(ApiWebApplicationFactory factory)
        {
            //_mockTokenService = new Mock<ITokenService>();
            _client = factory.CreateClient();
        }

        //private AccountController CreateController(AppDbContext context)
        //{
        //    return new AccountController(null, _mockTokenService.Object);
        //}

        [Fact]
        public async Task Register_Should_Create_User_When_Data_Is_Valid()
        {
            //Arrange 
            var userManagerMock = GetUserManagerMock();
            var tokenServiceMock = new Mock<ITokenService>();
            var envMock = new Mock<IWebHostEnvironment>();

            envMock.Setup(e => e.EnvironmentName).Returns("Testing");

            var controller = new AccountController(userManagerMock.Object, tokenServiceMock.Object, envMock.Object);

            //var registerDTO = new RegisterDTO
            //{
            //    DisplayName = "Filipe",
            //    Email = "filipe@email.com",
            //    Password = "1234",
            //    Gender = "Male",
            //    City = "BH",
            //    Country = "Brazil",
            //    DateOfBirth = new DateOnly(1990, 1, 1)
            //};
            var registerDTO = new UserFake().Generate();

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

        [Theory]
        [InlineData("", "1234", "Filipe")]
        [InlineData("test@test.com", "", "Filipe")]
        [InlineData("test@test.com", "1234", "")]
        public async Task Register_Should_Return_BadRequestWhen_Single_One_Required_Property_Is_Empty(
            string email, string password, string displayName)
        {
            var payload = new
            {
                email,
                password,
                displayName
            };

            var response = await _client.PostAsJsonAsync("/api/account/register", payload);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var problemDetails = await response.Content
                .ReadFromJsonAsync<ValidationProblemDetails>();

            problemDetails.Should().NotBeNull();

            problemDetails.Errors.Keys
                .Should().ContainSingle(key =>
                    key == nameof(RegisterDTO.DisplayName) ||
                    key == nameof(RegisterDTO.Email) ||
                    key == nameof(RegisterDTO.Password));
        }

        [Fact]
        public async Task Login_Should_Return_BadRequest_When_Email_Or_Password_Is_Empty()
        {
            // Arrange
            var userManagerMock = GetUserManagerMock();
            var tokenServiceMock = new Mock<ITokenService>();
            var envMock = new Mock<IWebHostEnvironment>();

            var controller = new AccountController(
                userManagerMock.Object, tokenServiceMock.Object, envMock.Object);
            
            var dto = new LoginDTO             {
                Email = "",
                Password = ""
            };

            // Act
            var result = await controller.Login(dto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Login_Should_Return_Unauthorized_When_User_Does_Not_Exist()
        {
            // Arrange
            var userManagerMock = GetUserManagerMock();
            var tokenServiceMock = new Mock<ITokenService>();
            var envMock = new Mock<IWebHostEnvironment>();

            var controller = new AccountController(
                userManagerMock.Object,
                tokenServiceMock.Object,
                envMock.Object);

            // Simulate user not found
            userManagerMock
                .Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((AppUser?)null);

            var dto = new LoginDTO
            {
                Email = "teste@email.com",
                Password = "1234"
            };

            // Act
            var result = await controller.Login(dto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
            ((ObjectResult)result.Result).Value.Should().Be("Invalid email address");
        }

        [Fact]
        public async Task Login_Should_Return_Unauthorized_When_Password_Is_Invalid()
        {
            // Arrange
            var userManagerMock = GetUserManagerMock();
            var tokenServiceMock = new Mock<ITokenService>();
            var envMock = new Mock<IWebHostEnvironment>();

            var controller = new AccountController(
                userManagerMock.Object,
                tokenServiceMock.Object,
                envMock.Object);

            var user = new AppUser() 
            {
                DisplayName = "Filipe",
                Email = "teste@email.com"
            };

            // Simulate user found 
            userManagerMock
                .Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            userManagerMock.Setup(x => x.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(false); // Simulate invalid password

            var dto = new LoginDTO
            {
                Email = "teste@email.com",
                Password = "senha_errada"
            };

            // Act
            var result = await controller.Login(dto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
            ((ObjectResult)result.Result).Value.Should().Be("Invalid password");
        }


        //[Fact]
        //public async Task Register_Should_Create_User_When_Data_Is_Valid()
        //{
        //    //Arrange 
        //    var userManagerMock = GetUserMAnagerMock();
        //    var tokenServiceMock = new Mock<ITokenService>();
        //    var envMock = new Mock<IWebHostEnvironment>();

        //    envMock.Setup(e => e.EnvironmentName).Returns("Testing");

        //    var controller = new AccountController(userManagerMock.Object, tokenServiceMock.Object, envMock.Object);
        //}

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

        private Mock<UserManager<AppUser>> GetUserManagerMock()
        {
            var store = new Mock<IUserStore<AppUser>>();

            return new Mock<UserManager<AppUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

    }
}

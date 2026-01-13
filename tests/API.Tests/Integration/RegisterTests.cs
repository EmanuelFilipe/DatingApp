using API.DTOs;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Json;

namespace API.Tests.Integration
{
    public class RegisterTests : IClassFixture<ApiWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public RegisterTests(ApiWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_Should_Return_BadRequest_When_Password_Is_Too_Short()
        {
            // Arrange
            var payload = new
            {
                displayName = "Filipe",
                email = "filipe@email.com",
                password = "123"
            };

            // Act
            var response = await _client.PostAsJsonAsync(
                "/api/account/register", payload);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var problemDetails = await response.Content
                .ReadFromJsonAsync<ValidationProblemDetails>();

            problemDetails.Should().NotBeNull();
            problemDetails!.Errors.Should().ContainKey("Password");
            problemDetails.Errors["Password"]
                .Should().Contain(msg => msg.Contains("minimum length"));
            problemDetails.Errors.Should().HaveCount(1);
        }

        [Fact]
        public async Task Register_Should_Return_BadRequest_When_Email_Is_Not_Valid()
        {
            // Arrange
            var payload = new
            {
                displayName = "Filipe",
                email = "filipe@email",
                password = "1234"
            };

            // Act
            var response = await _client.PostAsJsonAsync(
                "/api/account/register", payload);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var problemDetails = await response.Content
                .ReadFromJsonAsync<ValidationProblemDetails>();

            problemDetails.Should().NotBeNull();
            problemDetails!.Errors.Should().ContainKey("Email");
            problemDetails.Errors["Email"]
                .Should().Contain(msg => msg.Contains("Invalid Email"));
            problemDetails.Errors.Should().HaveCount(1);
        }

        [Theory]
        [InlineData("", "filipe@email.com", "1234")]   // DisplayName vazio
        [InlineData("Filipe", "", "1234")]              // Email vazio
        [InlineData("Filipe", "filipe@email.com", "")] // Password vazio
        public async Task Register_Should_Not_Create_Account_When_Single_One_Required_Property_Is_Blank(string displayName, string email, string password)
        {
            // Arrange
            var payload = new
            {
                displayName,
                email,
                password
            };

            // Act
            var response = await _client.PostAsJsonAsync(
                "/api/account/register", payload);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var problemDetails = await response.Content
                .ReadFromJsonAsync<ValidationProblemDetails>();

            problemDetails.Should().NotBeNull();
            
            problemDetails.Errors.Keys
                .Should().ContainSingle(key =>
                    key == nameof(RegisterDTO.DisplayName) ||
                    key == nameof(RegisterDTO.Email) ||
                    key == nameof(RegisterDTO.Password));

            problemDetails.Errors.Should().HaveCount(1);
        }
    }
}

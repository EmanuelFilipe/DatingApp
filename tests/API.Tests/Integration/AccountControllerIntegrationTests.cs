using API.DTOs;
using API.Tests.Fakes;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Json;

namespace API.Tests.Integration
{
    public class AccountControllerIntegrationTests : IClassFixture<ApiWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public AccountControllerIntegrationTests(ApiWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_Should_Return_BadRequest_When_Password_Is_Too_Short()
        {
            // Arrange
            var payload = new UserFake().Generate();
            payload.Password = "pa$";
            
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
            var payload = new UserFake().Generate();
            payload.Email = "filipe@email";

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
        [InlineData("", "filipe@email.com", "Pa$$w0rd1", "Male", "Belo Horizonte", "Brazil")]   // DisplayName vazio
        [InlineData("Filipe", "", "Pa$$w0rd1", "Male", "Belo Horizonte", "Brazil")]              // Email vazio
        [InlineData("Filipe", "filipe@email.com", "", "Male", "Belo Horizonte", "Brazil")] // Password vazio
        public async Task Register_Should_Not_Create_Account_When_Single_One_Required_Property_Is_Blank(
            string displayName, string email, string password, string gender, string city, string country)
        {
            // Arrange
            var payload = new
            {
                displayName,
                email,
                password,
                gender,
                city,
                country,
                dateOfBirth = new DateOnly(1990, 1, 1)
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
                    key == nameof(RegisterDTO.Password) ||
                    key == nameof(RegisterDTO.Gender) ||
                    key == nameof(RegisterDTO.City) ||
                    key == nameof(RegisterDTO.Country) ||
                    key == nameof(RegisterDTO.DateOfBirth));

            problemDetails.Errors.Should().HaveCount(1);
        }

        [Fact]
        public async Task Register_Should_Create_A_New_User_Without_Single_Error()
        {
            // Arrange
            //var payload = new
            //{
            //    displayName = "Filipe1",
            //    email = "filipe1@test.com",
            //    password = "Pa$$w0rd1",

            //    gender = "Male",
            //    city = "Belo Horizonte",
            //    country = "Brazil",
            //    dateOfBirth = new DateOnly(1990, 1, 1)
            //};
            var payload = new UserFake().Generate();

            // Act
            var response = await _client.PostAsJsonAsync(
                "/api/account/register", payload);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var problemDetails = await response.Content
                .ReadFromJsonAsync<ValidationProblemDetails>();

            problemDetails.Should().NotBeNull();
            problemDetails!.Errors.Count().Should().Be(0);
            problemDetails.Extensions["token"].Should().NotBeNull();
        }
    }
}

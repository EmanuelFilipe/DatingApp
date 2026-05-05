using API.Controllers;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Net;
using System.Security.Claims;

namespace API.Tests.Controllers
{
    public class MemberControllerTest
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IPhotoService> _mockPhotoService;

        public MemberControllerTest()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockPhotoService = new Mock<IPhotoService>();
        }
       

        [Fact]
        public async Task Get_List_Of_Members()
        {
            var members = new List<Member>
            {
                new Member { DisplayName = "Filipe", City = "BH", Country = "Brazil", Gender = "Male" },
                new Member { DisplayName = "Silva", City = "BH", Country = "Brazil", Gender = "Male" },
            };

            var paginatedResult = new PaginatedResult<Member>
            {
                Items = members,
                Metadata = new PaginationMetadata
                {
                    CurrentPage = 1,
                    TotalPages = 5,
                    PageSize = 10,
                    TotalCount = 2
                },
            };

            _mockUnitOfWork
                .Setup(x => x.MemberRepository.GetMembersAsync(It.IsAny<MemberParams>()))
                .ReturnsAsync(paginatedResult);

            var controller = new MembersController(
                 _mockUnitOfWork.Object,
                 _mockPhotoService.Object
             );

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user
                }
            };

            var memberParams = new MemberParams();

            // Act
            var result = await controller.GetMembers(memberParams);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();

            var returnedMembers = okResult!.Value as PaginatedResult<Member>;
            returnedMembers.Should().NotBeNull();
            returnedMembers.Items.Should().NotBeNull();
            returnedMembers.Items!.Count.Should().Be(2);
        }

        [Fact]
        public async Task Get_Member_By_Id()
        {
            var member = new Member
            {
                Id = "1",
                DisplayName = "Filipe",
                City = "BH",
                Country = "Brazil",
                Gender = "Male"
            };

            // injeta o member no repositório mockado para que o controller possa retornar esse membro quando solicitado
            _mockUnitOfWork
                .Setup(x => x.MemberRepository.GetMemberByIdAsync("1"))
                .ReturnsAsync(member);

            var controller = new MembersController(
                _mockUnitOfWork.Object,
                _mockPhotoService.Object
            );

            // Act
            var response = await controller.GetMember("1");

            // Assert
            var okResult = response.Result as OkObjectResult;

            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be((int)HttpStatusCode.OK);
            okResult?.Value.Should().NotBeNull();
            ((Member)okResult.Value).DisplayName.Should().Be(member.DisplayName);
        }
    }
}

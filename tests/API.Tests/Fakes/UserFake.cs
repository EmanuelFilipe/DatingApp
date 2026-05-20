using API.DTOs;
using API.Entities;
using Bogus;

namespace API.Tests.Fakes
{
    public class UserFake : Faker<RegisterDTO>
    {
        public UserFake() 
        {
            var faker = new Faker();
            DateTime birthDateTime = faker.Date.Past(65, DateTime.Now.AddYears(-18));
            DateOnly birthDate = DateOnly.FromDateTime(birthDateTime);

            string gender = faker.PickRandom(new[] { "Male", "Female" });

            CustomInstantiator(faker => new RegisterDTO
            { 
                DisplayName = faker.Name.FullName(),
                Email = faker.Internet.Email().ToLower(),
                Password = faker.Internet.Password(),
                Gender = gender,
                City = faker.Address.City(),
                Country = faker.Address.Country(),
                DateOfBirth = birthDate
            });
        }
    }
}

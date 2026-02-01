using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Member
    {
        public string Id { get; set; } = null!;
        public required string DisplayName { get; set; }
        public required string Gender { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }

        // Navigation property
        // não irá retornar no objeto json Response
        [JsonIgnore]
        [ForeignKey(nameof(Id))]
        public AppUser User { get; set; } = null!;

        [JsonIgnore]
        public List<Photo> Photos { get; set; } = [];
    }
}

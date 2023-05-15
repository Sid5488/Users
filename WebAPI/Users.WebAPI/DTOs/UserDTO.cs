using System;
using System.ComponentModel.DataAnnotations;

namespace Users.WebAPI.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; } = null;
        public DateTime? RemovedAt { get; set; } = null;
    }

    public class CreateUserDTO
    {
        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        public string Role { get; set; }
    }

    public class SaveUserDTO
    {
        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 30 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 30 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        public string Role { get; set; }
    }

    public class LoginUserDTO
    {
        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The field must contain between 3 to 50 characters")]
        public string Password { get; set; }
    }

    public class AuthenticatedUserDTO
    {
        public UserDTO User { get; set; }
        public string Token { get; set; }
    }
}

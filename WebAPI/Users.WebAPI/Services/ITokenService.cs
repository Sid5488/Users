using Users.WebAPI.Models;

namespace Users.WebAPI.Services
{
    public interface ITokenService
    {
        string GenerateToken(UserModel user);
    }
}

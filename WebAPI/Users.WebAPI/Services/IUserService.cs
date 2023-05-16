using System.Collections.Generic;
using System.Threading.Tasks;
using Users.WebAPI.DTOs;
using Users.WebAPI.Helpers;
using Users.WebAPI.Models;

namespace Users.WebAPI.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetPagineted(PageParams pageParams);
        Task<List<UserDTO>> Get();
        Task<dynamic> AuthenticateUser(string username, string password);
        Task<UserDTO> Create(SaveUserDTO model);
        Task<dynamic> Update(int id, SaveUserDTO model);
        Task<UserModel> GetById(int id);
        Task<UserModel> GetByUsername(string username);
        Task<bool> Delete(int id);
    }
}

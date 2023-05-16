using System.Collections.Generic;
using System.Threading.Tasks;
using Users.WebAPI.Helpers;
using Users.WebAPI.Models;

namespace Users.WebAPI.Repositories
{
    public interface IUserRepository
    {
        Task<List<UserModel>> Get();
        Task<PagaList<UserModel>> GetPagineted(PageParams pageParams);
        Task<UserModel> Get(string username, string password);
        Task<UserModel> Get(string username, bool removed = true);
        Task<UserModel> GetById(int id);
    }
}

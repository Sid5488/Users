using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Users.WebAPI.Data;
using Users.WebAPI.Helpers;
using Users.WebAPI.Models;

namespace Users.WebAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<PagaList<UserModel>> Get(PageParams pageParams)
        {
            IQueryable<UserModel> query = _context.Users
                .AsNoTracking()
                .Where(x => x.RemovedAt == null);

            query = query.OrderBy(x => x.Id);

            return await PagaList<UserModel>.CreateAsync(query, pageParams.PageNumber, pageParams.PageSize);
        }

        public async Task<UserModel> Get(string username, string password)
        {
            IQueryable<UserModel> query = _context.Users.AsNoTracking();

            return await query
                .FirstOrDefaultAsync(
                    x => x.Username.ToLower() == username &&
                    x.Password == password &&
                    x.RemovedAt == null
                );
        }

        public async Task<UserModel> GetById(int id)
        {
            IQueryable<UserModel> query = _context.Users.AsNoTracking();

            return await query.FirstOrDefaultAsync(x => x.Id == id && x.RemovedAt == null);
        }

        public async Task<UserModel> Get(string username, bool removed = true)
        {
            IQueryable<UserModel> query = _context.Users.AsNoTracking();

            return await query.FirstOrDefaultAsync( x => !removed 
                ? x.Username == username && x.RemovedAt != null
                : x.Username == username
            );
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Users.WebAPI.Models;

namespace Users.WebAPI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
    }
}

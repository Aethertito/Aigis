using Microsoft.EntityFrameworkCore;
using mvcfarm1.Models;

namespace mvcfarm1.Data
{
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options) { }


        public DbSet<Package> Packages { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}

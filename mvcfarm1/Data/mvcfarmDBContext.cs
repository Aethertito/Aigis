using Microsoft.EntityFrameworkCore;
using mvcfarm1.Models;

namespace mvcfarm1.Data
{
    public class mvcfarmDBContext : DbContext
    {
        public mvcfarmDBContext(DbContextOptions<mvcfarmDBContext> options)
            : base(options)
        {
        }

        public DbSet<Company> Company { get; set; }
    }
}

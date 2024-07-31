using Microsoft.EntityFrameworkCore;
using mvcfarm1.Models;

namespace mvcfarm1.Data
{
    public class mvcfarmDBContext : DbContext
    {
        public mvcfarmDBContext(DbContextOptions<mvcfarmDBContext> options) : base(options)
        {
        }

        public DbSet<Company> Company { get; set; }
        public DbSet<Package> Package { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Company>().ToTable("Company");
            modelBuilder.Entity<Package>().ToTable("Package");

            // Specify precision and scale for the Price property in the Package entity
            modelBuilder.Entity<Package>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}

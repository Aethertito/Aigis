using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mvcfarm1.Data;
using mvcfarm1.Models;

namespace mvcfarm1.Services
{
    public class PackageService : IPackageService
    {
        private readonly YourDbContext _context;

        public PackageService(YourDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Package>> GetAllPackagesAsync()
        {
            return await _context.Packages.ToListAsync();
        }

        public async Task<Package> GetPackageByIdAsync(int id)
        {
            return await _context.Packages.FindAsync(id);
        }

        public async Task<Package> CreatePackageAsync(Package package)
        {
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();
            return package;
        }

        public async Task UpdatePackageAsync(Package package)
        {
            _context.Entry(package).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePackageAsync(int id)
        {
            var package = await _context.Packages.FindAsync(id);
            if (package != null)
            {
                _context.Packages.Remove(package);
                await _context.SaveChangesAsync();
            }
        }
    }
}

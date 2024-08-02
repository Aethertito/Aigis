using mvcfarm1.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using mvcfarm1.Models;

namespace mvcfarm1.Services
{
    public interface IPackageService
    {
        Task<IEnumerable<Package>> GetAllPackagesAsync();
        Task<Package> GetPackageByIdAsync(int id);
        Task<Package> CreatePackageAsync(Package package);
        Task UpdatePackageAsync(Package package);
        Task DeletePackageAsync(int id);
    }
}

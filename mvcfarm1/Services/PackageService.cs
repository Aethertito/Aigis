using MongoDB.Driver;
using mvcfarm1.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace mvcfarm1.Services
{
    public class PackageService
    {
        private readonly IMongoCollection<Package> _packages;

        public PackageService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDB:ConnectionString"));
            var database = client.GetDatabase(config.GetSection("MongoDB:DatabaseName").Value);
            _packages = database.GetCollection<Package>("paquetes");
        }

        public async Task<List<Package>> GetAllPackagesAsync()
        {
            return await _packages.Find(package => true).ToListAsync();
        }
    }
}

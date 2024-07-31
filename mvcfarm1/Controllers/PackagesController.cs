using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Services;
using System.Threading.Tasks;

namespace mvcfarm1.Controllers
{
    public class PackagesController : Controller
    {
        private readonly PackageService _packageService;

        public PackagesController(PackageService packageService)
        {
            _packageService = packageService;
        }

        public async Task<IActionResult> Index()
        {
            var packages = await _packageService.GetAllPackagesAsync();
            return View(packages);
        }
    }
}

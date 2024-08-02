using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using mvcfarm1.Services;

namespace mvcfarm1.Controllers
{
    public class PackagesController : Controller
    {
        private readonly IPackageService _packageService;

        public PackagesController(IPackageService packageService)
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

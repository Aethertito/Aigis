using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Models;
using mvcfarm1.Services;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace mvcfarm1.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly PackageService _packageService;

        public HomeController(ILogger<HomeController> logger, PackageService packageService)
        {
            _logger = logger;
            _packageService = packageService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Charts()
        {
            return View();
        }

        public async Task<IActionResult> Packages()
        {
            var packages = await _packageService.GetAllPackagesAsync();
            return View(packages);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

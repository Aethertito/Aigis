using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Models;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace mvcfarm1.Controllers
{
    //Se puede colocar en cada vista o en general como aqui
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        //[Authorize]
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
        public IActionResult Packages()
        {
            return View(); 
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

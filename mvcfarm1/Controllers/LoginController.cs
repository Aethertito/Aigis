using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Data;
using mvcfarm1.Models;
using System.Threading.Tasks;

namespace mvcfarm1.Controllers
{
    public class LoginController : Controller
    {
        private readonly mvcfarmDBContext _mvcfarmDBContext;

        public LoginController(mvcfarmDBContext MvcfarmDBContext)
        {
            _mvcfarmDBContext = MvcfarmDBContext;
        }

        public IActionResult Login()
        {
            if (User.Identity!.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(Company model)
        {
            if (!string.IsNullOrEmpty(model.Email) && !string.IsNullOrEmpty(model.Password))
            {
                var user = _mvcfarmDBContext.Company
                                .FirstOrDefault(u => u.Email == model.Email && u.Password == model.Password);
                if (user != null)
                {
                    if (user.PackageId != 0)
                        HttpContext.Session.SetInt32("PackageId", user.PackageId);
                    else
                        HttpContext.Session.Clear();

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Role, user.Role)
                    };

                    ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    AuthenticationProperties properties = new AuthenticationProperties
                    {
                        AllowRefresh = true
                    };

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);

                    return RedirectToAction("Index", "Home");
                }
            }

            ViewData["Error"] = "Error, current user doesn't exist!";
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(Company company)
        {
            if (ModelState.IsValid)
            {
                company.Role = "User";  // Setting default role
                company.PackageId = 0;  // Default package ID

                _mvcfarmDBContext.Company.Add(company);
                await _mvcfarmDBContext.SaveChangesAsync();

                return RedirectToAction("Login");
            }

            ViewData["Error"] = "Error: Unable to register the user.";
            return View(company);
        }
    }
}

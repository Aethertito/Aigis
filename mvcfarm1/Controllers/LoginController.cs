using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Data;
using mvcfarm1.Models;

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace mvcfarm1.Controllers
{
    public class LoginController : Controller
    {
        private readonly mvcfarmDBContext _mvcfarmDBContext;
        //[ViewData]
        //public string isAdmin { get; set; }

        public LoginController(mvcfarmDBContext MvcfarmDBContext)
        {
            _mvcfarmDBContext = MvcfarmDBContext;
        }
        public IActionResult Login()
        {
            if(User.Identity!.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        //[Authorize(Roles = "Admin, User")]
        [HttpPost]
        public async Task<IActionResult> Login(Company model)
        {
            if (model.Email != null && model.Password != null && model.Email != "" && model.Password != "")
            {
                var user = _mvcfarmDBContext.Company
                                .Where(u => u.Email == model.Email && u.Password == model.Password)
                                .FirstOrDefault();
                if (user != null)
                {
                    if (user.PackageId != null && user.PackageId > 0)
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

            ViewData["Error"] = "Error, current user doesn't exists!";
            return View();
        }

  
        public async Task<IActionResult> Logout() {
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
                _mvcfarmDBContext.Company.Add(company);
                await _mvcfarmDBContext.SaveChangesAsync();                
            }

            if (company.Id != 0) 
            {
                return RedirectToAction("Login");
            }

            ViewData["Error"] = "Error cant register the user";

            return View();
        }

        //public IActionResult Success()
        //{
        //    return View();
        //}

        //public IActionResult Fail()
        //{
        //    return View();
        //}
    }
}

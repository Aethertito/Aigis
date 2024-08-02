using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Models;
using mvcfarm1.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace mvcfarm1.Controllers
{
    public class AccountController : Controller
    {
        private readonly IUsuarioService _usuarioService;

        public AccountController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View("~/Views/Login/Login.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Login(string correo, string contrasena)
        {
            if (await _usuarioService.ValidateUserCredentialsAsync(correo, contrasena))
            {
                var usuario = await _usuarioService.GetUsuarioByCorreoAsync(correo);
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, usuario.Nombre),
                    new Claim(ClaimTypes.Email, usuario.Correo),
                    new Claim(ClaimTypes.Role, usuario.Rol)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties { IsPersistent = true };

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
                return RedirectToAction("Profile", "Account");
            }

            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return View("~/Views/Login/Login.cshtml");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View("~/Views/Login/Register.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Register(Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                usuario.MemActiva = false;
                usuario.MemFechaInicio = null;
                usuario.MemFechaFin = null;
                usuario.PaqSelect = null;
                usuario.Sensores = null;
                usuario.MemCantidad = null;
                usuario.MemDescripcion = null;
                usuario.MemPeriodo = null;

                usuario.Contrasena = usuario.Contrasena;

                await _usuarioService.CreateUsuarioAsync(usuario);
                return RedirectToAction("Login", "Account");
            }
            return View("~/Views/Login/Register.cshtml");
        }

        [Authorize]
        public IActionResult Profile()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            if (claimsIdentity != null)
            {
                var claims = claimsIdentity.Claims;
                var userInfo = new
                {
                    Name = claimsIdentity.FindFirst(ClaimTypes.Name)?.Value,
                    Email = claimsIdentity.FindFirst(ClaimTypes.Email)?.Value,
                    Role = claimsIdentity.FindFirst(ClaimTypes.Role)?.Value
                };
                return View("~/Views/Login/Profile.cshtml", userInfo);
            }
            return RedirectToAction("Login");
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }
    }
}

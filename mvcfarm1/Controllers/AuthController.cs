using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Models;
using mvcfarm1.DataAccess;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace mvcfarm1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioDAL _usuarioDAL;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UsuarioDAL usuarioDAL, ILogger<AuthController> logger)
        {
            _usuarioDAL = usuarioDAL;
            _logger = logger;
        }

        // Método para el registro de usuarios
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_usuarioDAL.GetUsuarioByEmail(model.Email) != null)
            {
                return BadRequest("Ya existe un usuario con este correo.");
            }

            var usuario = new Usuario
            {
                Correo = model.Email,
                Contrasena = HashPassword(model.Password),
                Rol = "user",
                Nombre = model.FirstName,
                Direccion = model.Street,
                Telefono = model.Phone,
                Giro = model.Business
            };

            _usuarioDAL.CreateUsuario(usuario);

            return Ok("Usuario registrado exitosamente.");
        }

        // Método para el login de usuarios
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Intento de inicio de sesión para el usuario: {Email}", model.Email);

            var usuario = _usuarioDAL.GetUsuarioByEmail(model.Email);
            if (usuario == null)
            {
                _logger.LogWarning("Usuario no encontrado: {Email}", model.Email);
                return Unauthorized(new { Message = "Correo o contraseña incorrectos." });
            }

            if (!VerifyPassword(model.Password, usuario.Contrasena))
            {
                _logger.LogWarning("Contraseña incorrecta para el usuario: {Email}", model.Email);
                return Unauthorized(new { Message = "Correo o contraseña incorrectos." });
            }

            _logger.LogInformation("Inicio de sesión exitoso para el usuario: {Email}", model.Email);

            var userData = new
            {
                Id = usuario._id,
                Email = usuario.Correo,
                Role = usuario.Rol,
                FirstName = usuario.Nombre,
                Phone = usuario.Telefono,
                Street = usuario.Direccion,
                Business = usuario.Giro,
                Message = "Inicio de sesión exitoso."
            };

            return Ok(userData);
        }

        // Método para hashear la contraseña
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // Método para verificar la contraseña
        private bool VerifyPassword(string enteredPassword, string storedPasswordHash)
        {
            string enteredPasswordHash = HashPassword(enteredPassword);
            return enteredPasswordHash == storedPasswordHash;
        }
    }
}

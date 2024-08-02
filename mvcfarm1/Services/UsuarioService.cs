using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mvcfarm1.Data;
using mvcfarm1.Models;

namespace mvcfarm1.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly YourDbContext _context;

        public UsuarioService(YourDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario> CreateUsuarioAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> GetUsuarioByCorreoAsync(string correo)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Correo == correo);
        }

        public async Task<bool> ValidateUserCredentialsAsync(string correo, string contrasena)
        {
            var user = await GetUsuarioByCorreoAsync(correo);
            return user != null && user.Contrasena == contrasena;
        }
    }
}

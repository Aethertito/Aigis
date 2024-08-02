using System.Threading.Tasks;
using mvcfarm1.Models;

namespace mvcfarm1.Services
{
    public interface IUsuarioService
    {
        Task<Usuario> CreateUsuarioAsync(Usuario usuario);
        Task<Usuario> GetUsuarioByCorreoAsync(string correo);
        Task<bool> ValidateUserCredentialsAsync(string correo, string contrasena);
    }
}

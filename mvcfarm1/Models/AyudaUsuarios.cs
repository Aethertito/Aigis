using System;

namespace mvcfarm1.Models
{
    public class AyudaUsuarios
    {
        public string Id { get; set; }
        public string Correo { get; set; }
        public string Titulo { get; set; }
        public string Problema { get; set; }
        public string UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
    }
}

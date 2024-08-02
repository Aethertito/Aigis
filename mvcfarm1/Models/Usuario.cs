namespace mvcfarm1.Models
{
    public class Usuario
    {
        public string _id { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; }
        public string Rol { get; set; } = "user"; // Rol por defecto como "user"
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Giro { get; set; }
        public string Membresia { get; set; }
        public bool MemActiva { get; set; }
        public DateTime? MemFechaInicio { get; set; }
        public DateTime? MemFechaFin { get; set; }
        public string PaqSelect { get; set; }
        public string Sensores { get; set; }
        public int? MemCantidad { get; set; }
        public string MemDescripcion { get; set; }
        public string MemPeriodo { get; set; }
    }
}

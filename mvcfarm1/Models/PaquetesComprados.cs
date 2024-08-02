namespace mvcfarm1.Models
{
    public class PaquetesComprados
    {
        public string _id { get; set; }
        public string usuario { get; set; }
        public string paquete { get; set; }
        public string ubicacion { get; set; }
        public int precio { get; set; }
        public string sensores { get; set; } // Representa el JSON como string
    }
}

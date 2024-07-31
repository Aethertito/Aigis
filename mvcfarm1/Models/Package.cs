namespace mvcfarm1.Models
{
    public class Package
    {
        public string Id { get; set; } // Assuming MongoDB _id is a string
        public string Paquete { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public string[] Contenido { get; set; }
    }
}

using System;

namespace mvcfarm1.Models
{
    public class Pagos
    {
        public string _id { get; set; }
        public string usuario_id { get; set; }
        public string membresia_id { get; set; }
        public string metodoPago { get; set; }
        public string estado { get; set; }
        public DateTime fechaPago { get; set; }
        public int? cantidadPaquetes { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mvcfarm1.Models
{
    public class Usuario
    {
        [Key]
        [Column("_id")]
        public string Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(255)]
        public string Correo { get; set; }

        [Required]
        [MaxLength(255)]
        public string Contrasena { get; set; }

        [MaxLength(50)]
        public string Rol { get; set; }

        [MaxLength(255)]
        public string Direccion { get; set; }

        [MaxLength(50)]
        public string Telefono { get; set; }

        [MaxLength(50)]
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

using System.ComponentModel.DataAnnotations;

namespace mvcfarm1.Models
{
    public class Package
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public int Price { get; set; }

        public string Content { get; set; }
    }
}

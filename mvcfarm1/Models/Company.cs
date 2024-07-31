namespace mvcfarm1.Models
{
    public class Company
    {
        public int Id { get; set; }        
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string CP { get; set; }
        public string BusinessLine { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int PackageId { get; set; }
        //public Package Package { get; set; }

    }
}

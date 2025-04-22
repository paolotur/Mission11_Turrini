using System.ComponentModel.DataAnnotations;

namespace Mission11.API.Data
{
    public class Book
    {
        [Key]
        public int BookID { get; set; }  // Assuming this is the primary key
        [Required]
        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public string ISBN { get; set; }
        public string Classification { get; set; }
        public string Category { get; set; }
        public int PageCount { get; set; }
        public decimal Price { get; set; }

    }
}

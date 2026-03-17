/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    Book.cs

    This class represents a Book entity in the database.
    Each property corresponds to a column in the Books table
    of the SQLite database used in the bookstore application.
*/

using System.ComponentModel.DataAnnotations;

namespace Bookstore.API.Data
{
    public class Book
    {
        // Primary key for the Books table
        [Key]
        public int BookID { get; set; }

        // Title of the book
        [Required]
        public string Title { get; set; }

        // Author of the book
        [Required]
        public string Author { get; set; }

        // Publishing company
        [Required]
        public string Publisher { get; set; }

        // ISBN number used to uniquely identify the book
        [Required]
        public string ISBN { get; set; }

        // Category or classification of the book (ex: Fiction, Non-Fiction)
        [Required]
        public string Classification { get; set; }

        // Number of pages in the book
        [Required]
        public int PageCount { get; set; }

        // Price of the book
        [Required]
        public decimal Price { get; set; }
    }
}
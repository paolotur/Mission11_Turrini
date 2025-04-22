using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            int page = 1, int pageSize = 5, string sort = "Title", string order = "asc", string? category = null)
        {
            var booksQuery = _context.Books.AsQueryable();

            // Apply category filter if specified
            if (!string.IsNullOrEmpty(category))
            {
                booksQuery = booksQuery.Where(b => b.Category.ToLower() == category.ToLower());
            }

            // Apply sorting
            booksQuery = sort.ToLower() switch
            {
                "title" => (order.ToLower() == "desc")
                    ? booksQuery.OrderByDescending(b => b.Title)
                    : booksQuery.OrderBy(b => b.Title),

                "price" => (order.ToLower() == "desc")
                    ? booksQuery.OrderByDescending(b => b.Price)
                    : booksQuery.OrderBy(b => b.Price),

                _ => booksQuery.OrderBy(b => b.Title) // default sort
            };

            // Apply pagination
            var result = await booksQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(result);
        }
    }
}


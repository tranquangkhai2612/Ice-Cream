using System;
using Microsoft.AspNetCore.Mvc;
using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }

        
        // POST: api/Comment
        [HttpPost]
        public IActionResult AddComment([FromBody] CommentDTO commentDto)
        {
            if (commentDto == null || commentDto.FaqId <= 0 || commentDto.AccountId <= 0)
            {
                return BadRequest(new { Message = "Invalid data provided." });
            }

            var faqExists = _context.FAQs.Any(f => f.Id == commentDto.FaqId);
            var accountExists = _context.Accounts.Any(a => a.Id == commentDto.AccountId);

            if (!faqExists || !accountExists)
            {
                return BadRequest(new { Message = "Invalid FAQ ID or Account ID." });
            }

            var comment = new Comment
            {
                Title = commentDto.Title,
                Description = commentDto.Description,
                CreatedAt = DateTime.Now,
                AccountId = commentDto.AccountId,
                FaqId = commentDto.FaqId
            };

            _context.Comments.Add(comment);
            _context.SaveChanges();
            return Ok(comment);
        }

        // PUT: api/Comment/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateComment(int id, [FromBody] CommentDTO commentDto)
        {
            if (commentDto == null)
            {
                return BadRequest(new { Message = "Invalid data provided." });
            }

            var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (comment == null)
            {
                return NotFound(new { Message = "Comment not found." });
            }

            comment.Title = commentDto.Title;
            comment.Description = commentDto.Description;

            _context.SaveChanges();
            return Ok(comment);
        }

        // DELETE: api/Comment/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int id)
        {
            var comment = _context.Comments.Find(id);
            if (comment == null)
            {
                return NotFound(new { Message = "Comment not found." });
            }

            _context.Comments.Remove(comment);
            _context.SaveChanges();
            return Ok(new { Message = "Comment deleted successfully." });
        }
    }
}

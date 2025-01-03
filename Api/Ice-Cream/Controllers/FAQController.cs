using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FAQController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FAQController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FAQ
        [HttpGet]
        public IActionResult GetFAQs()
        {
            var faqs = _context.FAQs
                .ToList();
            return Ok(faqs);
        }

        //// GET: api/FAQ/{id}
        [HttpGet("{id}")]
        public IActionResult GetFaqById(int id)
        {
            // Fetch FAQ with related comments eagerly
            var faq = _context.FAQs
                .Include(f => f.Comments) // Include related comments
                .FirstOrDefault(f => f.Id == id);

            if (faq == null)
            {
                return NotFound(new { Message = "FAQ not found." });
            }

            // Return the FAQ with comments
            return Ok(new
            {
                faq.Id,
                faq.Question,
                faq.Answer,
                Comments = faq.Comments.Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Description,
                    c.CreatedAt,
                    c.AccountId
                })
            });
        }



        // POST: api/FAQ
        [HttpPost]
        public IActionResult CreateFAQ([FromBody] FAQDTO faqDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var faq = new FAQ
            {
                Question = faqDto.Question,
                Answer = faqDto.Answer
            };

            _context.FAQs.Add(faq);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetFaqById), new { id = faq.Id }, faq);
        }

        // PUT: api/FAQ/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateFAQ(int id, [FromBody] FAQDTO faqDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var faq = _context.FAQs.Find(id);
            if (faq == null)
            {
                return NotFound(new { Message = "FAQ not found." });
            }

            faq.Question = faqDto.Question;
            faq.Answer = faqDto.Answer;

            _context.SaveChanges();
            return Ok(faq);
        }

        // DELETE: api/FAQ/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteFAQ(int id)
        {
            var faq = _context.FAQs.Include(f => f.Comments).FirstOrDefault(f => f.Id == id);
            if (faq == null)
            {
                return NotFound(new { Message = "FAQ not found." });
            }

            _context.FAQs.Remove(faq);
            _context.SaveChanges();
            return Ok(new { Message = "FAQ deleted successfully." });
        }
    }
}

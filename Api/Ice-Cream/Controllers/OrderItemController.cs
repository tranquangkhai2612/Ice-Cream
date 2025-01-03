using Microsoft.AspNetCore.Mvc;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ice_Cream.DB;
using Ice_Cream.DTO;

namespace Ice_Cream.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class OrderItemController : ControllerBase
     {
          private readonly AppDbContext _context;

          public OrderItemController(AppDbContext context)
          {
               _context = context;
          }

          [HttpGet("all-orderitems")]
          public async Task<ActionResult<IEnumerable<OrderItemDTO>>> GetAllOrderItems(string? search = null)
          {
               var query = _context.OrderItems
                   .Include(oi => oi.Book)
                   .Include(oi => oi.Subscription)
                   .Include(oi => oi.Order)
                   .AsQueryable();

               if (!string.IsNullOrEmpty(search))
               {
                    search = search.ToLower();

                    query = query.Where(oi =>
                        (oi.Id.ToString().Contains(search)) ||
                        (oi.Book != null && oi.Book.Id.ToString().Contains(search)) ||
                        (oi.Subscription != null && oi.Subscription.Id.ToString().Contains(search)) ||
                        (oi.Order != null && oi.Order.Id.ToString().Contains(search))
                    );
               }

               var orderItems = await query.ToListAsync();
               var orderItemsDTO = orderItems.Select(item =>
               {
                    var bookDTO = item.Book == null ? null : new BookDTO
                    {
                         Id = item.Book.Id,
                         BookName = item.Book.BookName,
                         BookDescription = item.Book.BookDescription,
                         BookDate = item.Book.BookDate,
                         Price = item.Book.Price,
                         BookImage = item.Book.BookImage,
                    };

                    var subscriptionDTO = item.Subscription == null ? null : new SubscriptionDTO
                    {
                         Id = item.Subscription.Id,
                         SubType = item.Subscription.SubType,
                         SubDescription = item.Subscription.SubDescription,
                         SubPrice = item.Subscription.SubPrice
                    };

                    return new OrderItemDTO
                    {
                         Id = item.Id,
                         Quantity = item.Quantity,
                         Book = bookDTO,
                         Subscription = subscriptionDTO,
                         OrderPrice = item.OrderPrice,
                         OrderId = item.Order?.Id,
                         BookId = item.Book?.Id,
                         SubscriptionId = item.Subscription?.Id
                    };
               }).ToList();

               return Ok(orderItemsDTO);
          }

          [HttpGet("{id}")]
          public async Task<ActionResult<OrderItemDTO>> GetOrderItemById(int id)
          {
               var orderItem = await _context.OrderItems
                   .Include(oi => oi.Book)
                   .Include(oi => oi.Subscription)
                   .Include(oi => oi.Order)
                   .FirstOrDefaultAsync(oi => oi.Id == id);

               if (orderItem == null) return NotFound();

               var orderItemDTO = new OrderItemDTO
               {
                    Id = orderItem.Id,
                    Quantity = orderItem.Quantity,
                    Book = orderItem.Book == null ? null : new BookDTO
                    {
                         Id = orderItem.Book.Id,
                         BookName = orderItem.Book.BookName,
                         BookDescription = orderItem.Book.BookDescription,
                         BookDate = orderItem.Book.BookDate,
                         Price = orderItem.Book.Price,
                         BookImage = orderItem.Book.BookImage,
                    },
                    Subscription = orderItem.Subscription == null ? null : new SubscriptionDTO
                    {
                         Id = orderItem.Subscription.Id,
                         SubType = orderItem.Subscription.SubType,
                         SubDescription = orderItem.Subscription.SubDescription,
                         SubPrice = orderItem.Subscription.SubPrice
                    },
                    OrderPrice = orderItem.OrderPrice,
                    OrderId = orderItem.Order.Id
               };
               return Ok(orderItemDTO);
          }
     }
}

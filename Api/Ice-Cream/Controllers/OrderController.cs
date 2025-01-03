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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetAllOrders([FromQuery] string? search)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Subscription)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(o =>
                    (o.Email != null && o.Email.ToLower().Contains(search)) ||
                    (o.ContactDetails != null && o.ContactDetails.ToLower().Contains(search)) ||
                    (o.Address != null && o.Address.ToLower().Contains(search)) || (o.Id != null && o.Id.ToString().Contains(search))
                );
            }


            var orders = await query.ToListAsync();

            var ordersDTO = orders.Select(order => new OrderDTO
            {
                Id = order.Id,
                Email = order.Email,
                ContactDetails = order.ContactDetails,
                Address = order.Address,
                CreatedAt = order.CreatedAt,
                AccountId = order.AccountId,
                TotalAmount = order.TotalAmount,
                OrderItems = order.OrderItems == null
                    ? new List<OrderItemDTO>()
                    : order.OrderItems.Select(item => new OrderItemDTO
                    {
                        Id = item.Id,
                        BookId = item.BookId,
                        SubscriptionId = item.SubscriptionId,
                        Quantity = item.Quantity,
                        Book = item.Book == null ? null : new BookDTO
                        {
                            Id = item.Book.Id,
                            BookName = item.Book.BookName,
                            BookDescription = item.Book.BookDescription,
                            BookDate = item.Book.BookDate,
                            Price = item.Book.Price,
                            BookImage = item.Book.BookImage,
                        },
                        Subscription = item.Subscription == null ? null : new SubscriptionDTO
                        {
                            Id = item.Subscription.Id,
                            SubType = item.Subscription.SubType,
                            SubDescription = item.Subscription.SubDescription,
                            SubPrice = item.Subscription.SubPrice
                        }
                    }).ToList(),
            }).ToList();

            return Ok(ordersDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Subscription)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            var orderDTO = new OrderDTO
            {
                Id = order.Id,
                Email = order.Email,
                ContactDetails = order.ContactDetails,
                Address = order.Address,
                CreatedAt = order.CreatedAt,
                TotalAmount = order.TotalAmount,
                AccountId = order.AccountId,
                OrderItems = order.OrderItems == null
                    ? new List<OrderItemDTO>()
                    : order.OrderItems.Select(item => new OrderItemDTO
                    {
                        Id = item.Id,
                        Quantity = item.Quantity,
                        Book = item.Book == null ? null : new BookDTO
                        {
                            Id = item.Book.Id,
                            BookName = item.Book.BookName,
                            BookDate = item.Book.BookDate,
                            BookDescription = item.Book.BookDescription,
                            Price = item.Book.Price,
                            BookImage = item.Book.BookImage
                        },
                        Subscription = item.Subscription == null ? null : new SubscriptionDTO
                        {
                            Id = item.Subscription.Id,
                            SubType = item.Subscription.SubType,
                            SubDescription = item.Subscription.SubDescription,
                            SubPrice = item.Subscription.SubPrice
                        }
                    }).ToList()
            };

            return Ok(orderDTO);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(OrderDTO orderDTO)
        {

            var newOrder = new Order
            {
                Email = orderDTO.Email,
                ContactDetails = orderDTO.ContactDetails,
                Address = orderDTO.Address,
                CreatedAt = DateTime.UtcNow,
                AccountId = orderDTO.AccountId,
                TotalAmount = 0
            };

            decimal totalAmount = 0;

            foreach (var itemDTO in orderDTO.OrderItems)
            {
                var orderItem = new OrderItem
                {
                    Quantity = itemDTO.Quantity,
                    BookId = itemDTO.BookId,
                    SubscriptionId = itemDTO.SubscriptionId
                };

                if (orderItem.BookId != null)
                {
                    orderItem.Book = await _context.Books.FindAsync(orderItem.BookId);
                    if (orderItem.Book == null)
                    {
                        return NotFound($"Book with ID {orderItem.BookId} not found.");
                    }
                }

                if (orderItem.SubscriptionId != null)
                {
                    orderItem.Subscription = await _context.Subscriptions.FindAsync(orderItem.SubscriptionId);
                    if (orderItem.Subscription == null)
                    {
                        return NotFound($"Subscription with ID {orderItem.SubscriptionId} not found.");
                    }
                }

                decimal itemPrice = 0;
                if (orderItem.Book != null)
                {
                    itemPrice += (orderItem.Book.Price ?? 0) * orderItem.Quantity;
                }

                if (orderItem.Subscription != null)
                {
                    itemPrice += (orderItem.Subscription.SubPrice ?? 0) * orderItem.Quantity;
                }

                orderItem.OrderPrice = itemPrice;

                totalAmount += itemPrice;

                newOrder.OrderItems.Add(orderItem);
            }

            newOrder.TotalAmount = totalAmount;

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            var savedOrder = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Subscription)
                .FirstOrDefaultAsync(o => o.Id == newOrder.Id);

            var createdOrderDTO = new OrderDTO
            {
                Id = savedOrder.Id,
                Email = savedOrder.Email,
                ContactDetails = savedOrder.ContactDetails,
                Address = savedOrder.Address,
                CreatedAt = savedOrder.CreatedAt,
                AccountId = savedOrder.AccountId,
                TotalAmount = savedOrder.TotalAmount,
                OrderItems = savedOrder.OrderItems.Select(item => new OrderItemDTO
                {
                    Id = item.Id,
                    BookId = item.BookId,
                    SubscriptionId = item.SubscriptionId,
                    Quantity = item.Quantity,
                    OrderPrice = item.OrderPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrderById), new { id = savedOrder.Id }, createdOrderDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderDTO orderDTO)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null) return NotFound();

            existingOrder.Email = orderDTO.Email;
            existingOrder.ContactDetails = orderDTO.ContactDetails;
            existingOrder.Address = orderDTO.Address;
            existingOrder.CreatedAt = orderDTO.CreatedAt;
            existingOrder.AccountId = orderDTO.AccountId;
            existingOrder.TotalAmount = (decimal)orderDTO.TotalAmount;

            _context.Entry(existingOrder).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

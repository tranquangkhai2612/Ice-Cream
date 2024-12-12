using Microsoft.AspNetCore.Mvc;
using Ice_Cream.Models;
using Ice_Cream.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ice_Cream.DB;

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

        // Get All Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetAllOrders()
        {
            var ordersDTO = await _context.Orders
                .Select(o => new OrderDTO
                {
                    Id = o.Id,
                    Email = o.Email,
                    ContactDetails = o.ContactDetails,
                    Address = o.Address,
                    OrderType = o.OrderType,
                    OrderAmount = o.OrderAmount,
                    OrderPrice = o.OrderPrice,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return Ok(ordersDTO);
        }

        // Get Order By Id
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            var orderDTO = new OrderDTO
            {
                Id = order.Id,
                Email = order.Email,
                ContactDetails = order.ContactDetails,
                Address = order.Address,
                OrderType = order.OrderType,
                OrderAmount = order.OrderAmount,
                OrderPrice = order.OrderPrice,
                CreatedAt = order.CreatedAt
            };

            return Ok(orderDTO);
        }

        // Create New Order
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(OrderDTO orderDTO)
        {
            var newOrder = new Order
            {
                Email = orderDTO.Email,
                ContactDetails = orderDTO.ContactDetails,
                Address = orderDTO.Address,
                OrderType = orderDTO.OrderType,
                OrderAmount = orderDTO.OrderAmount,
                OrderPrice = orderDTO.OrderPrice,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = newOrder.Id }, orderDTO);
        }

        // Update Existing Order
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderDTO orderDTO)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null) return NotFound();

            existingOrder.Email = orderDTO.Email;
            existingOrder.ContactDetails = orderDTO.ContactDetails;
            existingOrder.Address = orderDTO.Address;
            existingOrder.OrderType = orderDTO.OrderType;
            existingOrder.OrderAmount = orderDTO.OrderAmount;
            existingOrder.OrderPrice = orderDTO.OrderPrice;
            existingOrder.CreatedAt = orderDTO.CreatedAt;

            _context.Entry(existingOrder).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete Order
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

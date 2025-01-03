using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Ice_Cream.DB;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Globalization;
using System.Net.Http.Headers;
using Ice_Cream.DTO;

namespace Ice_Cream.Controllers
{
     [Route("api/[controller]")]
     [ApiController]
     public class PaymentController : ControllerBase
     {
          private readonly IHttpClientFactory _httpClientFactory;
          private readonly AppDbContext _context;

          private readonly ILogger<PaymentController> _logger;
          public PaymentController(IHttpClientFactory httpClientFactory, AppDbContext context, ILogger<PaymentController> logger)
          {
               _httpClientFactory = httpClientFactory;
               _context = context;
               _logger = logger;
          }

          [HttpPost("create-payment")]
          public async Task<ActionResult> CreatePayment(decimal amount, int orderId)
          {
               string currency = "USD";
               // Create HTTP client for PayPal
               var client = _httpClientFactory.CreateClient("PayPal");

               // Fetch the order details
               var order = await _context.Orders
                   .FirstOrDefaultAsync(o => o.Id == orderId);
               if (order == null)
               {
                    return NotFound("Order not found.");
               }

               // Use totalAmount from the Order
               decimal totalAmount = order.TotalAmount; // Assuming the 'Order' entity has a 'TotalAmount' property

               // Build the purchase unit
               var purchaseUnit = new
               {
                    reference_id = $"{order.Id}",
                    amount = new
                    {
                         currency_code = currency,
                         value = totalAmount.ToString("F2", CultureInfo.InvariantCulture) // Use totalAmount here
                    }
               };

               var paymentData = new
               {
                    intent = "CAPTURE",
                    purchase_units = new[] { purchaseUnit },
                    application_context = new
                    {
                         return_url = $"http://localhost:5099/api/payment/success?orderId={orderId}",
                         cancel_url = $"http://localhost:5099/api/payment/cancel?orderId={orderId}"
                    }
               };

               // Send payment request to PayPal
               var content = new StringContent(JsonSerializer.Serialize(paymentData), Encoding.UTF8, "application/json");
               var response = await client.PostAsync("/v2/checkout/orders", content);

               if (response.IsSuccessStatusCode)
               {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseJson = Newtonsoft.Json.Linq.JObject.Parse(responseContent);

                    // Save the payment info to the database
                    var paymentInfo = new PaymentInfo
                    {
                         OrderId = order.Id,
                         AccountId = order.AccountId,
                         Amount = totalAmount,
                         Currency = currency,
                         Status = "Pending",
                         CreatedAt = DateTime.UtcNow,
                         TransactionId = responseJson["id"]?.ToString()
                    };

                    _context.PaymentInfos.Add(paymentInfo);
                    await _context.SaveChangesAsync();

                    // Retrieve the approval URL
                    var approvalUrl = responseJson["links"]?.FirstOrDefault(link => link["rel"]?.ToString() == "approve")?["href"]?.ToString();
                    if (!string.IsNullOrEmpty(approvalUrl))
                    {
                         return Ok(new { approvalUrl });
                    }
               }
               else
               {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return BadRequest(new { message = "Failed to create PayPal payment.", details = errorContent });
               }

               return BadRequest("Failed to create PayPal payment.");
          }



          [HttpGet("success")]
          public async Task<IActionResult> PaymentSuccess(string token, string payerId)
          {
               // Use the existing logger for consistency
               var logger = HttpContext.RequestServices.GetService<ILogger<PaymentController>>();

               if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(payerId))
               {
                    _logger?.LogError("Payment failed: Missing token or PayerID.");
                    return BadRequest("Missing token or PayerID.");
               }

               try
               {
                    var client = _httpClientFactory.CreateClient("PayPal");
                    var emptyJson = new StringContent("{}", Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "A21AAL156N0ttaYuC2fkZDpZ3IVliasekPp0s4YXzOsgXV0oH--RIi9KyA0U2EWB8R1_sX_Wcf1cHBPwrbofW-juOzuaZp_cA");
                    var captureResponse = await client.PostAsync($"https://api.sandbox.paypal.com/v2/checkout/orders/{token}/capture", emptyJson);

                    if (captureResponse.IsSuccessStatusCode)
                    {
                         var captureContent = await captureResponse.Content.ReadAsStringAsync();
                         logger?.LogInformation("Payment capture successful. Response: {Response}", captureContent);
                         var captureJson = Newtonsoft.Json.Linq.JObject.Parse(captureContent);
                         var transactionId = captureJson["id"]?.ToString();
                         var status = captureJson["status"]?.ToString();

                         logger?.LogInformation("Transaction ID: {TransactionId}, Status: {Status}", transactionId, status);
                         var paymentInfo = await _context.PaymentInfos.FirstOrDefaultAsync(p => p.TransactionId == token);
                         if (paymentInfo != null)
                         {
                              paymentInfo.Status = "Paid";
                              _context.PaymentInfos.Update(paymentInfo);
                              await _context.SaveChangesAsync();

                              logger?.LogInformation("Payment status updated in database.");
                         }
                         else
                         {
                              logger?.LogWarning("No payment info found for token: {Token}", token);
                         }

                         var redirectUrl = $"http://localhost:5173/bill/{paymentInfo.OrderId}";
                         return Redirect(redirectUrl);
                    }
                    else
                    {
                         var errorContent = await captureResponse.Content.ReadAsStringAsync();
                         logger?.LogError("Failed to capture payment. Response: {ErrorResponse}", errorContent);

                         return StatusCode((int)captureResponse.StatusCode, new
                         {
                              Message = "Failed to capture payment",
                              ErrorDetails = errorContent
                         });
                    }
               }
               catch (Exception ex)
               {
                    _logger?.LogError(ex, "An exception occurred while capturing payment.");
                    return StatusCode(500, "An error occurred while processing the payment.");
               }
          }




          [HttpGet("cancel")]
          public async Task<IActionResult> PaymentCancelAsync(int orderId)
          {
               var paymentInfo = await _context.PaymentInfos
                        .FindAsync(orderId);
               paymentInfo.Status = "Cancelled";
               await _context.SaveChangesAsync();
               return Ok("Payment Cancelled");
          }

          [HttpGet("all-payments")]
          public async Task<IActionResult> GetAllPayments([FromQuery] string search = "")
          {
               search = search?.ToLower() ?? "";

               var paymentInfos = await _context.PaymentInfos
                   .Include(p => p.Order)
                   .Where(p =>
                       string.IsNullOrEmpty(search) ||
                       p.TransactionId.ToLower().Contains(search) ||
                       p.Id.ToString().Contains(search) ||
                       p.Order.Id.ToString().Contains(search)
                   )
                   .Select(p => new PaymentDTO
                   {
                        Id = p.Id,
                        OrderId = p.Order.Id,
                        AccountId = p.AccountId,
                        Amount = p.Amount,
                        Currency = p.Currency,
                        Status = p.Status,
                        CreatedAt = p.CreatedAt,
                        TransactionId = p.TransactionId
                   })
                   .ToListAsync();

               return Ok(paymentInfos);
          }



          [HttpGet("payment/{id}")]
          public async Task<ActionResult<PaymentDTO>> GetPaymentById(int id)
          {
               var paymentInfo = await _context.PaymentInfos
                    .Include(p => p.Order)
                   .FirstOrDefaultAsync(p => p.Id == id);

               if (paymentInfo == null)
               {
                    return NotFound("Payment not found.");
               }

               var paymentInfoDTO = new PaymentDTO
               {
                    Id = paymentInfo.Id,
                    OrderId = paymentInfo.Order.Id,
                    Amount = paymentInfo.Amount,
                    Currency = paymentInfo.Currency,
                    Status = paymentInfo.Status,
                    CreatedAt = paymentInfo.CreatedAt,
                    TransactionId = paymentInfo.TransactionId,
               };

               return Ok(paymentInfoDTO);
          }

          [HttpGet("combined-details/{orderId}")]
          public async Task<ActionResult<OrderPaymentDetailsDTO>> GetCombinedDetails(int orderId)
          {
               var order = await _context.Orders
                   .Include(o => o.PaymentInfo)
                   .Include(o => o.OrderItems)
                   .ThenInclude(oi => oi.Book)
                   .Include(o => o.OrderItems)
                   .ThenInclude(oi => oi.Subscription)
                   .FirstOrDefaultAsync(o => o.Id == orderId);

               if (order == null)
               {
                    return NotFound("Order not found.");
               }

               var combinedDetails = new OrderPaymentDetailsDTO
               {
                    OrderId = order.Id,
                    Email = order.Email,
                    Address = order.Address,
                    TotalAmount = order.TotalAmount,
                    AccountId = (int)order.AccountId,
                    CreatedAt = (DateTime)order.CreatedAt,
                    PaymentInfo = order.PaymentInfo != null ? new PaymentDTO
                    {
                         Id = order.PaymentInfo.Id,
                         Status = order.PaymentInfo.Status,
                         TransactionId = order.PaymentInfo.TransactionId,
                         Amount = order.PaymentInfo.Amount,
                         Currency = order.PaymentInfo.Currency,
                         CreatedAt = order.PaymentInfo.CreatedAt,
                         OrderId = order.PaymentInfo.OrderId
                    } : null,
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

               return Ok(combinedDetails);
          }

          [HttpGet("get-access-token")]
          public async Task<IActionResult> GetAccessToken()
          {
               try
               {
                    var clientId = "ASr3VDLf54GJNJEycXj7upC2dnAFaKxwhqg76d8AY5PYpJl98MZVNMOv1WHqOlSp6RAmN4-3Sw3cV2vG"; // Replace with your PayPal Client ID
                    var clientSecret = "EF_zeuiz_8I9kHgAKZGOnlgrQFFwKFS8l7ocUjSVbnWbUm1FQzWmgAseMVzvatUU1yqDDrQ68cUw3byS"; // Replace with your PayPal Client Secret

                    var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
                    var client = _httpClientFactory.CreateClient();

                    var request = new HttpRequestMessage(HttpMethod.Post, "https://api.sandbox.paypal.com/v1/oauth2/token")
                    {
                         Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "client_credentials" }
                })
                    };

                    request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);
                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                         var jsonResponse = await response.Content.ReadAsStringAsync();
                         var tokenJson = Newtonsoft.Json.Linq.JObject.Parse(jsonResponse);
                         var accessToken = tokenJson["access_token"]?.ToString();
                         return Ok(new { AccessToken = accessToken });
                    }
                    else
                    {
                         var errorResponse = await response.Content.ReadAsStringAsync();
                         return BadRequest(new { Message = "Failed to get access token", Error = errorResponse });
                    }
               }
               catch (Exception ex)
               {
                    return StatusCode(500, new { Message = "An error occurred", Details = ex.Message });
               }
          }
     }
}

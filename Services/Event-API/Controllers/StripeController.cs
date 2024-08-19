

using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Collections.Generic;
using Domain.Entities;
using Application.DTO.EventDTOs;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class StripeController : ControllerBase
{
    private readonly string _secretKey;
    private readonly Application.Services.Event_User_Service _event_User_Service;

    public StripeController(IConfiguration configuration, Application.Services.Event_User_Service event_User_Service)
    {
        _secretKey = configuration["Stripe:SecretKey"];
        _event_User_Service = event_User_Service;
    }

    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession ([FromBody] CheckoutRequest checkoutRequest)
    {
        StripeConfiguration.ApiKey = _secretKey;
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = checkoutRequest.Amount,
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Event Ticket"
                        },
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&ticket_id=" + checkoutRequest.TicketId + "&eventid=" + checkoutRequest.EventId + "&userid=" + checkoutRequest.UserId,
            CancelUrl = "http://localhost:3000/payment-cancel",
            Metadata = new Dictionary<string, string>
            {
                { "TicketId", checkoutRequest.TicketId.ToString() },
                { "EventId", checkoutRequest.EventId.ToString() },
                { "UserId", checkoutRequest.UserId.ToString() }
            }
        };
        var service = new SessionService();
        var session = service.Create(options);
        return Ok(new { id = session.Id });
    }

    [HttpPost("payment-success")]
    public async Task<IActionResult> PaymentSuccess([FromQuery] string SessionId)
    {
        if (string.IsNullOrEmpty(SessionId))
        {
            return BadRequest(new { message = "SessionId is required." });
        }

        try
        {
            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(SessionId);

            if (session.PaymentStatus == "paid")
            {
                var transactionDTO = new TransactionDTO
                {
                    TicketId = int.Parse(session.Metadata["TicketId"]),
                    UserId = int.Parse(session.Metadata["UserId"]),
                    eventid = int.Parse(session.Metadata["EventId"])
                };
                await _event_User_Service.CreateTransaction(transactionDTO);
                return Ok(new
                {
                    message = "Payment successful and transaction created.",
                    ticketId = transactionDTO.TicketId,
                    eventId = transactionDTO.eventid
                });
            }
            return BadRequest(new { message = "Payment not successful." });
        }
        catch (Exception ex)
        {
            // Log the exception
            return StatusCode(500, new { message = "An error occurred while processing the payment.", error = ex.Message });
        }
    }
    public class CheckoutRequest
    {
        public long Amount { get; set; }
        public int TicketId { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
    }

    public class PaymentSuccessRequest
    {
        public string SessionId { get; set; }
    }
}

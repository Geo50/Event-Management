using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly string _secretKey;

    public PaymentController(IConfiguration configuration)
    {
        _secretKey = configuration["Stripe:SecretKey"];
    }

    [HttpPost("create-checkout-session")]
    public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest checkoutRequest)
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
                        UnitAmount = checkoutRequest.Amount, // Amount in cents
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
            SuccessUrl = "http://localhost:3000/payment-success={CHECKOUT_SESSION_ID}",
            CancelUrl = "http://localhost:3000/homepage",
        };

        var service = new SessionService();
        var session = service.Create(options);

        return Ok(new { id = session.Id });
    }
}

public class CheckoutRequest
{
    public long Amount { get; set; } 
}

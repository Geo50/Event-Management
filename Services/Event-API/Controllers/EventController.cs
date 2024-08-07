using Application.DTO.EventDTOs;
using Application.JwtToken;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Event_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class EventController : Controller
    {

        private readonly Application.Services.EventService _eventService;
        private readonly JwtTokenService _tokenService;


        public EventController(Application.Services.EventService eventService, JwtTokenService tokenService)
        {
            _eventService = eventService;
            _tokenService = tokenService;
        }

        [HttpPost("CreateNewEvent")]

        public async Task<IActionResult> CreateNewEvent(CreateEventDTO createEventDTO)
        {
            await _eventService.CreateNewEvent(createEventDTO);
            return Ok();
        }

        [HttpPost("CreateNewTicket")]

        //public async Task<IActionResult> CreateNewTicket(CreateTicketDTO createTicketDTO)
        //{
        //    await _eventService.CreateNewEvent(createTicketDTO);
        //    return Ok();
        //}

        [HttpGet("GetEventsInHomepage")]

        public async Task<ActionResult<IEnumerable<Event>>> GetEventsInHomepage()
        {
            var events = await _eventService.GetEventsInHomepage();
            return Ok(events);
        }

        [HttpPost("GetEventInDetails")]

        public async Task<ActionResult<IEnumerable<CombinedProperties>>> GetEventInDetails( [FromQuery] int eventId)
        {
            var eventDetails = await _eventService.GetEventInDetails(eventId);
            return Ok(eventDetails);
        }
    }
}

using Application.DTO.EventDTOs;
using Application.JwtToken;
using Application.Services;
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
        private readonly Application.Services.Event_User_Service _event_User_Service;
        private readonly JwtTokenService _tokenService;


        public EventController(Application.Services.EventService eventService, Event_User_Service event_User_Service, JwtTokenService tokenService)
        {
            _eventService = eventService;
            _event_User_Service = event_User_Service;
            _tokenService = tokenService;
        }

        [HttpPost("CreateNewEvent")]

        public async Task<IActionResult> CreateNewEvent(CreateEventDTO createEventDTO)
        {
            try
            {
                int eventId = await _eventService.CreateNewEvent(createEventDTO);
                return Ok(new { EventId = eventId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("CreateNewTicket")]

        public async Task<IActionResult> CreateNewTicket(CreateTicketDTO createTicketDTO)
        {
            await _eventService.CreateNewTicket(createTicketDTO);
            return Ok();
        }

        [HttpGet("GetEventsInHomepage")]

        public async Task<ActionResult<IEnumerable<Event>>> GetEventsInHomepage()
        {
            var events = await _eventService.GetEventsInHomepage();
            return Ok(events);
        }

        [HttpPost("GetEventAttendees")]

        public async Task<ActionResult<int>> GetEventAttendees(int eventId)
        {
            var limit = await _eventService.GetEventAttendees(eventId);
            return Ok(limit);
        }


        [HttpPost("GetEventInDetails")]

        public async Task<ActionResult<IEnumerable<CombinedProperties>>> GetEventInDetails( [FromQuery] int eventId)
        {
            var eventDetails = await _eventService.GetEventInDetails(eventId);
            return Ok(eventDetails);
        }

        [HttpPost("CreateNewBookmark")]

        public async Task<IActionResult> CreateNewBookmark( Bookmarks bookmark)
        {
            await _event_User_Service.CreateNewBookmark(bookmark);
            return Ok();
        }

        [HttpPost("GetEventsInProfile")]

        public async Task<ActionResult<IEnumerable<Event>>> GetEventsInProfile(int UserId)
        {
            var events = await _event_User_Service.GetEventsInProfile(UserId);
            return Ok(events);
        }

        [HttpGet("GetEventTickets")]

        public async Task<ActionResult<IEnumerable<ViewTicketDTO>>> GetEventTickets(int eventId)
        {
            var tickets = await _eventService.GetEventTickets(eventId);
            return Ok(tickets);
        }

        [HttpGet("GetUsernameFromId")]

        public async Task<ActionResult<string>> GetUsernameFromId(int userid)
        {
            var username = await _eventService.GetUsernameFromId(userid);
            return Ok(username);
        }

        [HttpPost("CreateTransaction")]
        public async Task<IActionResult> CreateTransaction(TransactionDTO transactionDTO)
        {
            await _event_User_Service.CreateTransaction(transactionDTO);
            return Ok();
        }

        [HttpGet("GetTransaction")]

        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransaction(int UserId)
        {
            var transaction = await _event_User_Service.GetTransaction(UserId);
            return Ok(transaction);
        }

        [HttpGet("GetBoughtTickets")]

        public async Task<ActionResult<IEnumerable<ViewBoughtTicketsDTO>>> GetBoughtTickets(int UserId)
        {
            var tickets = await _event_User_Service.GetBoughtTickets(UserId);
            return Ok(tickets);
        }

        [HttpPut("UpdateTicketStatus")]

        public async Task<ActionResult> UpdateTicketStatus(UpdateTicketStatusDTO updateTicketStatusDTO)
        {
            await _event_User_Service.UpdateTicketStatus(updateTicketStatusDTO);
            return Ok();
        }

        [HttpPost("GetTransactionsPerUserEvent")]
        public async Task<ActionResult<int>> GetTransactionsPerUserEvent([FromBody] TransactionCountDTO transactionCountDTO)
        {
            try
            {
                var count = await _event_User_Service.GetTransactionsPerUserEvent(transactionCountDTO);
                return Ok(count);
            }
            catch (Exception ex)
            {
                // Log the exception (e.g., using a logging framework)
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpGet("GetTransactionsPerEvent")]
        public async Task<ActionResult<int>> GetTransactionsPerEvent([FromQuery] int eventid)
        {
            try
            {
                var count = await _event_User_Service.GetTransactionsPerEvent(eventid);
                return Ok(count);
            }
            catch (Exception ex)
            {
                // Log the exception (e.g., using a logging framework)
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpPost("GetEventMaxTicketsPerUser")]
        public async Task<int> GetEventMaxTicketsPerUser([FromQuery]int eventid)
        {
            var maxTickets = await _eventService.GetEventMaxTicketsPerUser(eventid);
            return maxTickets;
        }

    }
}

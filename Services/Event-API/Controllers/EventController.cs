﻿using Application.DTO.EventDTOs;
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

        public async Task<ActionResult<IEnumerable<CombinedProperties>>> GetEventsInProfile(int UserId)
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
    }
}

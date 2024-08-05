using Application.DTO.EventDTOs;
using Application.JwtToken;
using Microsoft.AspNetCore.Mvc;

namespace Event_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class EventController : Controller
    {

        private readonly Application.Services.Event _eventService;
        private readonly JwtTokenService _tokenService;


        public EventController(Application.Services.Event eventService, JwtTokenService tokenService)
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
    }
}

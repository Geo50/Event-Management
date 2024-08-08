using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO.EventDTOs;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Repositories;

namespace Application.Services
{
    public interface IEventService
    {
        public Task<IEnumerable<EventService>> GetEventByName(string EventName);
        public Task<IEnumerable<GetEventsDTO>> GetEventsInHomepage();
        public Task<IEnumerable<EventService>> UpdateEventByName(string EventName);
        public Task DeleteEvent(string EventName);
        public Task CreateNewEvent(CreateEventDTO newEvent);
        public Task<bool> GetDate(DateTime date);
        public Task<bool> GetPlace(string place);
        public Task<IEnumerable<CreateEventDTO>> GetEventInDetails(int eventId);



    }

    public class EventService : IEventService
    {
        private readonly EventRepository _repository;
        private readonly IMapper _mapper;
        public EventService (EventRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task CreateNewEvent(CreateEventDTO EventDTO)
        {
            var newEvent = _mapper.Map<CombinedProperties>(EventDTO);
            await _repository.CreateNewEvent(newEvent);
        }

        public async Task<IEnumerable<CreateEventDTO>> GetEventInDetails(int eventId)
        {
            var eventDetails = await _repository.GetEventInDetails(eventId);
            var eventDTO = _mapper.Map<IEnumerable<CreateEventDTO>>(eventDetails);
            return eventDTO;
        }

        //public Task CreateTicket(CreateTicketDTO TicketDTO)
        //{
        //    var newTicket = _mapper.Map<Tickets>(TicketDTO);
        //    return _repository.CreateNewTicket(newTicket);
        //}

        public async Task<IEnumerable<GetEventsDTO>> GetEventsInHomepage()
        {
            var events = await _repository.GetEventsInHomepage();
            var eventDTOs = _mapper.Map<IEnumerable<GetEventsDTO>>(events);
            return eventDTOs;
        }
        public Task<bool> GetDate(DateTime date)
        {
            return _repository.GetDate(date);
        }

        public Task<bool> GetPlace(string place)
        {
            return _repository.GetPlace(place);
        }

        public Task DeleteEvent(string EventName)
        {
            throw new NotImplementedException();
        }


        public Task<IEnumerable<EventService>> GetEventByName(string EventName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<EventService>> UpdateEventByName(string EventName)
        {
            throw new NotImplementedException();
        }
    }
}

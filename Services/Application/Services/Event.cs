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
    public interface IEvent
    {
        public Task<IEnumerable<Event>> GetEventByName(string EventName);
        public Task<IEnumerable<Event>> GetAllEvents();
        public Task<IEnumerable<Event>> UpdateEventByName(string EventName);
        public Task DeleteEvent(string EventName);
        public Task CreateNewEvent(CreateEventDTO newEvent);
        public Task<bool> GetDate(DateTime date);
        public Task<bool> GetPlace(string place);


    }

    public class Event : IEvent
    {
        private readonly EventRepository _repository;
        private readonly IMapper _mapper;
        public Event (EventRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public Task CreateNewEvent(CreateEventDTO EventDTO)
        {
            var newEvent = _mapper.Map<CombinedProperties>(EventDTO);
            return _repository.CreateNewEvent(newEvent);
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

        public Task<IEnumerable<Event>> GetAllEvents()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetEventByName(string EventName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> UpdateEventByName(string EventName)
        {
            throw new NotImplementedException();
        }
    }
}

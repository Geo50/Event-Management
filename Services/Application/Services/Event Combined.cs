using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Application.DTO.EventDTOs;
using Domain.Entities;
using SQL_Queries.Queries;

namespace Application.Services
{
        public interface IEventService
        {
            Task<CreateEventDTO> GetEventInDetails(string eventName);
        }

        public class EventService : IEventService
        {
            private readonly EventRepository _eventRepository;
            private readonly IMapper _mapper;

            public EventService(EventRepository eventRepository, IMapper mapper)
            {
                _eventRepository = eventRepository;
                _mapper = mapper;
            }

        public async Task<CreateEventDTO> GetEventDetailsById(int eventId)
        {
            var (eventEntity, eventDetailsEntity, ticketsEntities) = await _eventrepository.GetEventDetailsByIdAsync(eventId);

            if (eventEntity == null) return null;

            var eventDTO = _mapper.Map<CreateEventDTO>(eventEntity);
            var eventDetailsDTO = _mapper.Map<CreateEventDTO>(eventDetailsEntity);
            var ticketsDTO = ticketsEntities.Select(t => _mapper.Map<CreateEventDTO>(t)).ToList();

            return new CreateEventDTO
            {
                EventName = eventDTO.EventName,
                EventDate = eventDTO.EventDate,
                EventPlace = eventDTO.EventPlace,
                EventType = eventDTO.EventType,
                EventImage = eventDTO.EventImage,
                EventDescription = eventDetailsDTO.EventDescription,
                TicketName = ticketsDTO
            };
        }

    }

}
}

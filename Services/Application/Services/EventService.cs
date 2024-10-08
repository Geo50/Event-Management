﻿using System;
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
        public Task<int> GetEventAttendees(int eventId);
        public Task<IEnumerable<EventService>> UpdateEventByName(string EventName);
        public Task DeleteEvent(string EventName);
        public Task<int> CreateNewEvent(CreateEventDTO newEvent);
        public Task CreateNewTicket(CreateTicketDTO createTicketDTO);
        public Task<IEnumerable<ViewTicketDTO>> GetEventTickets(int eventId);
        public Task<bool> GetDate(DateTime date);
        public Task<bool> GetPlace(string place);
        public Task<IEnumerable<CreateEventDTO>> GetEventInDetails(int eventId);
        public Task<string> GetUsernameFromId(int userid);
        public Task<int> GetEventMaxTicketsPerUser(int eventid);



    }

    public class EventService : IEventService
    {
        private readonly EventRepository _repository;
        private readonly IMapper _mapper;
        public EventService(EventRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> GetEventMaxTicketsPerUser(int eventid)
        {
            var maxTickets = await _repository.GetEventMaxTicketsPerUser(eventid);
            return maxTickets;
        }
        public async Task<int> CreateNewEvent(CreateEventDTO EventDTO)
        {
            var newEvent = _mapper.Map<CombinedProperties>(EventDTO);
            var eventId = await _repository.CreateNewEvent(newEvent);
            return eventId;
        }

        public async Task<string> GetUsernameFromId(int userid)
        {
            var username = await _repository.GetUsernameFromId(userid);
            return username;
        }

        public async Task CreateNewTicket(CreateTicketDTO createTicketDTO)
        {
            var newTicket = _mapper.Map<Tickets>(createTicketDTO);
            await _repository.CreateNewTicket(newTicket);
        }

        public async Task<IEnumerable<ViewTicketDTO>> GetEventTickets(int eventId)
        {
            var ticketDetails = await _repository.GetEventTickets(eventId);
            var ticketDTO = _mapper.Map<IEnumerable<ViewTicketDTO>>(ticketDetails);
            return ticketDTO;
        }

        public async Task<IEnumerable<CreateEventDTO>> GetEventInDetails(int eventId)
        {
            var eventDetails = await _repository.GetEventInDetails(eventId);
            var eventDTO = _mapper.Map<IEnumerable<CreateEventDTO>>(eventDetails);
            return eventDTO;
        }


        public async Task<IEnumerable<GetEventsDTO>> GetEventsInHomepage()
        {
            var events = await _repository.GetEventsInHomepage();
            var eventDTOs = _mapper.Map<IEnumerable<GetEventsDTO>>(events);
            return eventDTOs;
        }
        public async Task<int> GetEventAttendees(int eventId)
        {
            var limit = await _repository.GetEventAttendees(eventId);
            return limit;
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

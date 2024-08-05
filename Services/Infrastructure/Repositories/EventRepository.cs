using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using SQL_Queries.Queries;
using Dapper;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using System.Data.Common;
using Microsoft.Extensions.Logging;
using System.Collections;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace Infrastructure.Repositories
{
    public interface IEventRepository
    {
        public Task<IEnumerable<Event>> GetEventsInHomepage();
        public Task<int> GetEventIdByName(string eventName);
        public Task<IEnumerable<Event>> GetEventInDetails(int eventId);
        public Task CreateNewEvent(CombinedProperties newEvent);
        public Task<bool> GetDate(DateTime date);
        public Task<bool> GetPlace(string place);
    }

    public class EventRepository : IEventRepository
    {
        private readonly IConfiguration _configuration;
        public EventRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection Connection => new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        public async Task<bool> GetDate(DateTime dateToCreate)
        {
            var query = EventQueries.GetDate; 
            using (var connection = Connection)
            {
                var result = await connection.QuerySingleOrDefaultAsync<DateTime?>(query, new { Date = dateToCreate });
                return result.HasValue;
            }
        }

        public async Task<bool> GetPlace(string place)
        {
            var query = EventQueries.GetPlace; 
            using (var connection = Connection)
            {
                var result = await connection.QuerySingleOrDefaultAsync<string>(query, new { Place = place });
                return result != null;
            }
        }
        
        public async Task<IEnumerable<Event>> GetEventsInHomepage()
        {
            var query = EventQueries.GetEventsInHomepage;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<Event>(query);
                return result;
            }
        }
        public async Task CreateNewEvent(CombinedProperties newEvent)
        {
            var insertEvent = EventQueries.CreateNewEvent;
            var insertTicket = EventQueries.InsertTickets;
            var insertEventDetails = EventQueries.InsertEventDetails;
            bool hasSameDate = await GetDate(newEvent.EventDate);
            bool hasSamePlace = await GetPlace(newEvent.EventPlace);


            using (var connection = Connection)
            {
                if ((hasSameDate) && (hasSamePlace))
                {
                    throw new Exception("Sorry, cannot create new event with same date and place as an already existing event");
                }
                else
                {
                    int eventId = await connection.ExecuteScalarAsync<int>(insertEvent, new
                    {
                        EventName = newEvent.EventName,
                        EventDate = newEvent.EventDate,
                        EventPlace = newEvent.EventPlace,
                        EventType = newEvent.EventType,
                        EventImage = newEvent.EventImage,
                    });

                    int ticketid = await connection.ExecuteScalarAsync<int>(insertTicket, new
                    {
                        EventId = eventId,
                        TicketName = newEvent.TicketName,
                        TicketPrice = newEvent.TicketPrice
                    });

                    await connection.ExecuteAsync(insertEventDetails, new
                    {
                        EventId = eventId,
                        EventDescription = newEvent.EventDescription,
                        TicketId = ticketid
                    });
                }

            }
        }


        //public async Task<int> GetEventIdByNameAsync(string eventName)
        //{
        //    var query = "SELECT eventid FROM public.event WHERE eventname = @eventname;";

        //    using (var connection = Connection)
        //    {
        //        return await connection.QueryFirstOrDefaultAsync<int>(query, new { eventname = eventName });
        //    }
        //}

        //public async Task<(Event, EventDetails, IEnumerable<Tickets>)> GetEventDetailsByIdAsync(int eventId)
        //{
        //    var query = "SELECT e.*, ed.*, t.* " +
        //                "FROM public.event e " +
        //                "JOIN public.event_details ed ON e.eventid = ed.eventid " +
        //                "LEFT JOIN public.tickets t ON e.eventid = t.eventid " +
        //                "WHERE e.eventid = @eventid;";

        //    using (var connection = Connection)
        //    {
        //        var result = await connection.QueryMultipleAsync(query, new { eventid = eventId });

        //        var newEvent = await result.ReadFirstOrDefaultAsync<Event>();
        //        var eventDetailsEntity = await result.ReadFirstOrDefaultAsync<EventDetails>();
        //        var ticketsEntities = await result.ReadAsync<Tickets>();

        //        return (newEvent, eventDetailsEntity, ticketsEntities);
        //    }
        //}


        public Task<int> GetEventIdByName(string eventName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetEventInDetails(int eventId)
        {
            throw new NotImplementedException();
        }
    }
}

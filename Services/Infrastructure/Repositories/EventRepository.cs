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


namespace Infrastructure.Repositories
{
    public interface IEventRepository
    {
        public Task<IEnumerable<Event>> GetEventsInHomepage();
        public Task<int> GetEventIdByName(string eventName);
        public Task<IEnumerable<Event>> GetEventInDetails(int eventId);
        public Task CreateNewEvent(Event newEvent);
    }

    public class EventRepository : IEventRepository
    {
        private readonly IConfiguration _configuration;
        public EventRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection Connection => new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        public async Task<IEnumerable<Event>> GetEventsInHomepage()
        {
            var query = EventQueries.GetEventsInHomepage;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<Event>(query);
                return result;
            }
        }

        public async Task<int> GetEventIdByNameAsync(string eventName)
        {
            var query = "SELECT eventid FROM public.event WHERE eventname = @eventname;";

            using (var connection = Connection)
            {
                return await connection.QueryFirstOrDefaultAsync<int>(query, new { eventname = eventName });
            }
        }

        public async Task<(Event, EventDetails, IEnumerable<Tickets>)> GetEventDetailsByIdAsync(int eventId)
        {
            var query = "SELECT e.*, ed.*, t.* " +
                        "FROM public.event e " +
                        "JOIN public.event_details ed ON e.eventid = ed.eventid " +
                        "LEFT JOIN public.tickets t ON e.eventid = t.eventid " +
                        "WHERE e.eventid = @eventid;";

            using (var connection = Connection)
            {
                var result = await connection.QueryMultipleAsync(query, new { eventid = eventId });

                var eventEntity = await result.ReadFirstOrDefaultAsync<Event>();
                var eventDetailsEntity = await result.ReadFirstOrDefaultAsync<EventDetails>();
                var ticketsEntities = await result.ReadAsync<Tickets>();

                return (eventEntity, eventDetailsEntity, ticketsEntities);
            }
        }


        public Task CreateNewEvent(Event newEvent)
        {
            throw new NotImplementedException();
        }

    }
}

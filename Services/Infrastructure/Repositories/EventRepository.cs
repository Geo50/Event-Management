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
        public Task<IEnumerable<CombinedProperties>> GetEventInDetails(int eventId);
        public Task<int> CreateNewEvent(CombinedProperties newEvent);
        public Task<bool> GetDate(DateTime date);
        public Task<bool> GetPlace(string place);
        public Task CreateNewTicket(Tickets tickets);
        public Task<IEnumerable<Tickets>> GetEventTickets(int eventid);
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
        public async Task<IEnumerable<Tickets>>GetEventTickets(int eventid)
        {
            var query = EventQueries.GetEventTickets;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<Tickets>(query, new { Eventid = eventid });
                return result;
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
        public async Task<int> CreateNewEvent(CombinedProperties newEvent)
        {
            var insertEvent = EventQueries.CreateNewEvent;
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

                    await connection.ExecuteAsync(insertEventDetails, new
                    {
                        EventId = eventId,
                        EventDescription = newEvent.EventDescription,
                        //TicketId = ticketid
                    });
                    return eventId;
                }
                }


            }
        public async Task CreateNewTicket(Tickets tickets)
        {
            var query = EventQueries.CreateNewTicket;
            using (var connection = Connection)
            {
                await connection.ExecuteAsync(query, new
                {
                    eventid = tickets.EventId,
                    ticketname = tickets.TicketName,
                    ticketprice = tickets.TicketPrice,
                    category = tickets.Category,
                    benefits = tickets.Benefits
                });
            }
        }
        public Task<int> GetEventIdByName(string eventName)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<CombinedProperties>> GetEventInDetails(int eventId)
        {
            var query = EventQueries.GetEventInDetails;
            using (var connection = Connection)
                {
                    var result = await connection.QueryAsync<CombinedProperties>(query, new
                    {
                        eventid = eventId
                    });
                    return result;
                }
            }
        }
    } 

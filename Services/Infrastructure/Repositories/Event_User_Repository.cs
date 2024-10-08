﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;
using SQL_Queries.Queries;

namespace Infrastructure.Repositories
{
    public interface IEvent_User_Repository
    {
        public Task CreateNewBookmark(Bookmarks bookmark);
        public Task<IEnumerable<Event>> GetEventsInProfile(int UserId);
        public Task<IEnumerable<Transaction>> GetTransaction(int UserId);
        public Task CreateTransaction(Transaction transaction);
        public Task<IEnumerable<CombinedProperties>> GetBoughtTickets(int UserId);
        public Task UpdateTicketStatus(Tickets tickets);
        public Task IncrementTicketStatus(Tickets tickets);
        public Task<int> GetTransactionsPerUserEvent (Transaction transaction);
        public Task<int> GetTransactionsPerEvent (int eventid);
        public Task DeleteBoughtTicket(Transaction transaction);
        public Task DeleteBookmark (Bookmarks bookmark);
    }

    public class Event_User_Repository : IEvent_User_Repository 
    {
        private readonly IConfiguration _configuration;
        public Event_User_Repository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection Connection => new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        public async Task DeleteBookmark(Bookmarks bookmark)
        {
            var query = Event_User_Queries.DeleteBookmark;
            using (var connection = Connection)
            {
                await connection.QuerySingleOrDefaultAsync(query, new
                {
                    eventid = bookmark.EventId,
                    userid = bookmark.UserId
                });
            }
        }
        public async Task DeleteBoughtTicket(Transaction transaction)
        {
            var query = Event_User_Queries.DeleteBoughtTicket;
            using (var connection = Connection)
            {
                 await connection.QuerySingleOrDefaultAsync(query, new
                {
                    eventid = transaction.eventid,
                    ticketid = transaction.TicketId,
                    userid = transaction.UserId
                });
                

            }
        }

        public async Task UpdateTicketStatus(Tickets tickets)
        {
            var query = Event_User_Queries.UpdateTicketStatus;
            using (var connection = Connection)
            {
                await connection.ExecuteAsync(query, new
                {
                    eventid = tickets.EventId,
                    ticketid = tickets.TicketId,
                });
            }
        }
        public async Task IncrementTicketStatus(Tickets tickets)
        {
            var query = Event_User_Queries.IncrementTicketStatus;
            using (var connection = Connection)
            {
                await connection.ExecuteAsync(query, new
                {
                    eventid = tickets.EventId,
                    ticketid = tickets.TicketId,
                });
            }
        }
        public async Task<int> GetTransactionsPerUserEvent(Transaction transaction)
        {
            var query = Event_User_Queries.GetTransactionsPerUserEvent;
            using (var connection = Connection)
            {
                var count = await connection.QuerySingleAsync<int>(query, new
                {
                    eventid = transaction.eventid,
                    Userid = transaction.UserId
                });
                return count;
            }
        }
        public async Task<int> GetTransactionsPerEvent(int eventid)
        {
            var query = Event_User_Queries.GetTransactionsPerEvent;
            using (var connection = Connection)
            {
                var count = await connection.QuerySingleAsync<int>(query, new
                {
                    eventid 
                });
                return count;
            }
        }


        public async Task<IEnumerable<CombinedProperties>> GetBoughtTickets(int UserId)
        {
            var query = Event_User_Queries.GetBoughtTickets;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<CombinedProperties>(query, new
                {
                    userid = UserId
                });
                return result;
            }
        }

        public async Task CreateNewBookmark(Bookmarks bookmark)
        {
            var query = Event_User_Queries.CreateNewBookmark;
            using (var connection = Connection)
            {
                try
                {
                    await connection.ExecuteAsync(query, new
                    {
                        UserId = bookmark.UserId,
                        EventId = bookmark.EventId,
                        EventName = bookmark.EventName
                    });
                }
                catch (Npgsql.PostgresException ex)
                {
                    // Check if the exception is due to a unique constraint violation
                    if (ex.SqlState == "23505") // PostgreSQL error code for unique constraint violation
                    {
                        throw new InvalidOperationException("Bookmark already exists.");
                    }
                }
            }

        }

        public async Task CreateTransaction(Transaction transaction)
        {
            var query = Event_User_Queries.CreateTransaction;
            using (var connection = Connection)
            {
                try
                {
                    await connection.ExecuteAsync(query, new
                    {
                        ticketid = transaction.TicketId,
                        eventid = transaction.eventid,
                        userid = transaction.UserId
                    });
                }
                catch (Npgsql.PostgresException ex)
                {
                    if (ex.SqlState == "23505") 
                    {
                        throw new InvalidOperationException("You already bought this ticket");
                    }
                }
            }
        }

        public async Task<IEnumerable<Transaction>> GetTransaction(int UserId)
        {
            var query = Event_User_Queries.GetTransaction;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<Transaction>(query, new
                {
                    userid = UserId,
                });
                return result;
            }
        }
        public async Task<IEnumerable<Event>> GetEventsInProfile(int UserId)
        {
            var query = Event_User_Queries.GetEventsInProfile;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<Event>(query, new
                {
                    userid = UserId,
                });
                return result;
            }
        }
    }
}

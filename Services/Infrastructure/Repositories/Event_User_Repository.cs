using System;
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
        public Task<IEnumerable<CombinedProperties>> GetEventsInProfile(int UserId);
    }

    public class Event_User_Repository : IEvent_User_Repository
    {
        private readonly IConfiguration _configuration;
        public Event_User_Repository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection Connection => new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        public async Task CreateNewBookmark(Bookmarks bookmark)
        {
            var query = Event_User_Queries.CreateNewBookmark;
            using (var connection = Connection)
            {
                await connection.ExecuteAsync(query, new
                {
                    UserId = bookmark.UserId,
                    EventId = bookmark.EventId,
                    EventName = bookmark.EventName
                });
            }
        }

        public async Task<IEnumerable<CombinedProperties>> GetEventsInProfile(int UserId)
        {
            var query = Event_User_Queries.GetEventsInProfile;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<CombinedProperties>(query, new
                {
                    userid = UserId,
                });
                return result;
            }
        }
    }
}

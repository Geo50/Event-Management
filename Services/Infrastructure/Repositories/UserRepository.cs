using System.Data;
using AutoMapper;
using Dapper;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using SQL_Queries.Queries;
using BCrypt.Net;

namespace Infrastructure.Repositories
{
    public interface IUserRepository
    {
        public Task<IEnumerable<User>> GetAllUsers();
        public Task<User> GetUserById(int userId);
        public Task<User> GetRegisteredUser(string userName);
        public Task UpdateUserById(int userid);
        public Task CreateNewUser(User newUser);
        public Task UpdatePassword(User user);


    }

    public class UserRepository : IUserRepository
    {
        private readonly IConfiguration _configuration;

        public UserRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private IDbConnection Connection => new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));


        //END OF CONFIGURATION, START OF LOGIC

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var query = UserQueries.GetAllUsers;
            using (var connection = Connection)
            {
                var result = await connection.QueryAsync<User>(query);
                return result;
            }
        }

        public async Task CreateNewUser(User newUser)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newUser.UserPassword);

            var query = UserQueries.CreateNewUser;
            using (var connection = Connection)
            {
                await connection.ExecuteAsync(query, new
                {
                    UserName = newUser.UserName,
                    UserEmail = newUser.UserEmail,
                    UserPassword = hashedPassword,
                    IsAdmin = newUser.isadmin,
                    pass_verification_answer = newUser.PassVerificationAnswer
                });
            }
        }


        public async Task<User> GetRegisteredUser(string userName)
        {
            var query = UserQueries.GetRegisteredUser;

            using (var connection = Connection)
            {
                return await connection.QueryFirstOrDefaultAsync<User>(query, new
                {
                    UserName = userName
                });
            }
        }

        public async Task UpdatePassword(User user)
        {
            var getQuery = UserQueries.GetPasswordVerificationAnswer;

            using (var connection = Connection)
            {
                var storedVerificationAnswer = await connection.QueryFirstOrDefaultAsync<string>(getQuery, new
                {
                    UserName = user.UserName
                });

                if (storedVerificationAnswer == user.PassVerificationAnswer)
                {
                    var updateQuery = UserQueries.UpdateUserPassword;
                    await connection.ExecuteAsync(updateQuery, new
                    {
                        UserPassword = user.UserPassword,
                        UserName = user.UserName
                    });
                }
                else
                {
                    throw new UnauthorizedAccessException("Verification answer is incorrect.");
                }
            }
        }


            public Task<User> GetUserById(int userId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateUserById(int userid)
        {
            throw new NotImplementedException();
        }
    }
}

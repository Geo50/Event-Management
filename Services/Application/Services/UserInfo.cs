using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Infrastructure.Repositories;
using Application.DTO;
using AutoMapper;

namespace Application.Services
{
    public interface IUserInfo
    {
        public Task<IEnumerable<Domain.Entities.User>> GetAllUsers();
        public Task<User> VerifyUserCredentials(LoginDTO loginDTO);
        public Task CreateNewUser(CreateUserDTO newUserDTO);
        public Task UpdateUserById(int userid);


    }
    public class UserInfo : IUserInfo
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;


        public UserInfo(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;

        }

        public Task CreateNewUser(CreateUserDTO newUserDTO)
        {
            var newUser = _mapper.Map<User>(newUserDTO);
            return _repository.CreateNewUser(newUser);
        }

        public async Task<User> VerifyUserCredentials(LoginDTO loginDTO)
        {
            // Retrieve user by username
            var user = await _repository.GetRegisteredUser(loginDTO.UserName);

            if (user == null)
            {
                return null;
            }

            // Verify password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDTO.UserPassword, user.UserPassword);

            if (isPasswordValid)
            {
                // Valid credentials
                return user;
            }
            else
            {
                // Invalid credentials
                return null;
            }
        }


        public Task<IEnumerable<Domain.Entities.User>> GetAllUsers()
        {
            var users = _repository.GetAllUsers();
            return users;
        }


        public Task UpdateUserById(int userid)
        {
            var updatedUser = _repository.UpdateUserById(userid);
            return updatedUser;
        }
    }

}

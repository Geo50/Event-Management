﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Infrastructure.Repositories;
using AutoMapper;
using Application.DTO.UserDTOs;

namespace Application.Services
{
    public interface IUserInfo
    {
        public Task<IEnumerable<Domain.Entities.User>> GetAllUsers();
        public Task<User> VerifyUserCredentials(LoginDTO loginDTO);
        public Task CreateNewUser(CreateUserDTO newUserDTO);
        public Task UpdateUserById(int userid);
        public Task<User> GetUserByUName(string UName);
        public Task UpdateUserPassword(PasswordForgotDTO passwordForgot);
        public Task<User> GetUserById(int userId);
        public Task UpdateUsername(UpdateUsernameDTO updateUsernameDTO);
        public Task UpdateUserEmail(UpdateEmailDTO updateEmailDTO);



    }
    public class UserInfo : IUserInfo
    {
        private readonly UserRepository _repository;
        private readonly IMapper _mapper;


        public UserInfo(UserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;

        }

        public async Task<User> GetUserById(int userid)
        {
            return await _repository.GetUserById(userid);
        }


        public Task CreateNewUser(CreateUserDTO newUserDTO)
        {
            var newUser = _mapper.Map<User>(newUserDTO);
            return _repository.CreateNewUser(newUser);
        }

        public Task UpdateUserPassword(PasswordForgotDTO passwordForgot)
        {
            var userEntity = _mapper.Map<User>(passwordForgot); 
            var updatedPassword = _repository.UpdatePassword(userEntity);
            return updatedPassword;
        }

        public Task UpdateUsername(UpdateUsernameDTO updateUsernameDTO)
        {
            var userEntity = _mapper.Map<User>(updateUsernameDTO);
            var updatedUsername = _repository.UpdateUsername(userEntity);
            return updatedUsername;
        }
        public Task UpdateUserEmail(UpdateEmailDTO updateEmailDTO)
        {
            var userEntity = _mapper.Map<User>(updateEmailDTO);
            var updatedEmail = _repository.UpdateUserEmail(userEntity);
            return updatedEmail;
        }

        public async Task<User> GetUserByUName(string UName)
        {
            var user = await _repository.GetRegisteredUser(UName);
            return user;
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

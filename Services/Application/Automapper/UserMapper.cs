﻿using AutoMapper;
using Domain.Entities;
using Application.DTO.UserDTOs;
using Application.DTO.EventDTOs;

namespace Application
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<CreateUserDTO, User>().ReverseMap();

            CreateMap<LoginDTO, User>().ReverseMap();

            CreateMap<PasswordForgotDTO, User>().ReverseMap();


            //***************** EVENT MAPPING ENTITY TO DTO *****************

            CreateMap<CombinedProperties, CreateEventDTO>().ReverseMap();

            CreateMap<Event, GetEventsDTO>().ReverseMap();

            CreateMap<Tickets, CreateTicketDTO>().ReverseMap();            
        }
    }
}
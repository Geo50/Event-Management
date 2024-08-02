using AutoMapper;
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

            CreateMap<Event, CreateEventDTO>();

            CreateMap<EventDetails, CreateEventDTO>()
                .ReverseMap()   
                .ForMember(dest => dest.EventDescription, opt => opt.MapFrom(src => src.EventDescription));

            CreateMap<Tickets, CreateEventDTO>()
                .ForMember(dest => dest.TicketName, opt => opt.MapFrom(src => src.TicketName))
                .ForMember(dest => dest.TicketPrice, opt => opt.MapFrom(src => src.TicketPrice));
        }
    }
}
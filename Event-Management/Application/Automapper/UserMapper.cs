using AutoMapper;
using Application.DTO;
using Domain.Entities;

namespace Application
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<CreateUserDTO, User>().ReverseMap();

            CreateMap<LoginDTO, User>().ReverseMap();
        }
    }
}

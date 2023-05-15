using AutoMapper;
using Users.WebAPI.DTOs;
using Users.WebAPI.Models;

namespace Users.WebAPI.Helpers
{
    public class UsersProfile : Profile
    {
        public UsersProfile()
        {
            CreateMap<UserModel, UserDTO>();
            CreateMap<UserDTO, UserModel>();
            CreateMap<UserModel, SaveUserDTO>().ReverseMap();
            CreateMap<SaveUserDTO, UserModel>();
            CreateMap<SaveUserDTO, UserDTO>();
        }
    }
}

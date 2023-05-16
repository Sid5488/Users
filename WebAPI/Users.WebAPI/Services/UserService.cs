using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Users.WebAPI.DTOs;
using Users.WebAPI.Helpers;
using Users.WebAPI.Models;
using Users.WebAPI.Repositories;

namespace Users.WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public UserService(
            IUserRepository userRepository,
            IRepository repository,
            IMapper mapper,
            ITokenService tokenService
        )
        {
            _userRepository = userRepository;
            _repository = repository;
            _mapper = mapper;
            _tokenService = tokenService;

        }

        public async Task<dynamic> AuthenticateUser(string username, string password)
        {
            UserModel user = await _userRepository.Get(username, PasswordHash.StringForHash(password));

            if (user == null)
                return null;

            var token = _tokenService.GenerateToken(user);
            var mapperDTO = new
            {
                User = _mapper.Map<UserDTO>(user),
                Token = token
            };

            return mapperDTO;
        }

        public async Task<UserDTO> Create(SaveUserDTO model)
        {
            var exists = await GetByUsername(model.Username);

            if (exists != null)
                return null;

            model.Password = PasswordHash.StringForHash(model.Password);

            var user = _mapper.Map<UserModel>(model);
            user.UpdatedAt = null;
            user.RemovedAt = null;

            _repository.Add(user);
            await _repository.SaveChangesAsync();

            return _mapper.Map<UserDTO>(user); ;
        }

        public async Task<dynamic> Update(int id, SaveUserDTO model)
        {
            var user = await GetById(id);
            var exists = await GetByUsername(model.Username);

            if(user.Username != model.Username)
            {
                if (exists != null)
                    return "User already exists";
            }

            if (user == null)
                return "User not found";

            model.Password = PasswordHash.StringForHash(model.Password);

            _mapper.Map<SaveUserDTO, UserModel>(model, user);

            user.UpdatedAt = DateTime.Now;
            user.Id = id;

            _repository.Update(user);
            await _repository.SaveChangesAsync();

            return _mapper.Map<UserDTO>(model);
        }

        public async Task<UserModel> GetById(int id)
        {
            return await _userRepository.GetById(id);
        }

        public async Task<UserModel> GetByUsername(string username)
        {
            var user = await _userRepository.Get(username, false);

            return user;
        }

        public async Task<bool> Delete(int id)
        {
            var user = await _userRepository.GetById(id);

            if (user == null)
                return false;

            user.RemovedAt = DateTime.Now;

            _repository.Update(user);
            await _repository.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<UserDTO>> GetPagineted(PageParams pageParams)
        {
            var users = await _userRepository.GetPagineted(pageParams);
            var mappeds = _mapper.Map<IEnumerable<UserDTO>>(users);

            return mappeds;
        }

        public async Task<List<UserDTO>> Get()
        {
            var users = await _userRepository.Get();
            var mappeds = _mapper.Map<List<UserDTO>>(users);

            return mappeds;
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Users.WebAPI.DTOs;
using Users.WebAPI.Helpers;
using Users.WebAPI.Services;

namespace Users.WebAPI.Controllers
{
    [ApiController]
    [Route("v1/api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "ReadWrite,Read")]
        public async Task<ActionResult<UserDTO>> GetPagineted([FromQuery] PageParams pageParams)
        {
            return Ok(await _userService.GetPagineted(pageParams));
        }

        [HttpGet]
        [Authorize(Roles = "ReadWrite,Read")]
        [Route("all")]
        public async Task<ActionResult<UserDTO>> Get()
        {
            return Ok(await _userService.Get());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "ReadWrite,Read")]
        public async Task<ActionResult<UserDTO>> GetById(int id)
        {
            return Ok(await _userService.GetById(id));
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Create([FromBody] SaveUserDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userService.Create(model);

            if (user == null)
                return BadRequest(new { Message = "User already exists" });

            return Created($"/v1/api/user/{user.Id}", user);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<ActionResult<UserDTO>> AuthenticateAsync([FromBody] LoginUserDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = await _userService.AuthenticateUser(model.Username, model.Password);

            if (result == null)
                return BadRequest(new { Message = "Username or password invalids" });

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ReadWrite,Read")]
        public async Task<ActionResult<dynamic>> Update(int id, [FromBody] SaveUserDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userService.GetById(model.Id);

            if (model.Id != id && user.Role != "ReadWrite")
                return Unauthorized(new { Message = "You can't change data from another user" });

            var result = await _userService.Update(id, model);

            if (result.GetType() == typeof(string))
                return BadRequest(new { Message = result });

            return Ok(result);
        }

        [HttpDelete("{id}/{userId}")]
        [Authorize(Roles = "ReadWrite,Read")]
        public async Task<ActionResult> Delete(int id, int userId)
        {
            if (id <= 0)
                return BadRequest(new { Message = "Field Id must be bigger than 0" });

            var user = await _userService.GetById(userId);

            if (user.Id != id && user.Role != "ReadWrite")
                return Unauthorized(new { Message = "You can't change data from another user" });

            var result = await _userService.Delete(id);

            if (!result)
                return BadRequest(new { Message = "User not found" });

            return NoContent();
        }
    }
}

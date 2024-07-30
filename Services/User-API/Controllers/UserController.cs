using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Domain.Entities;
using Application.DTO;
using Application.JwtToken;
using Microsoft.AspNetCore.Authorization;

namespace User_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly Application.Services.UserInfo _userService;
        private readonly JwtTokenService _tokenService;


        public UserController(Application.Services.UserInfo userService, JwtTokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("CreateNewUser")]

        public async Task<IActionResult> CreateNewUser(CreateUserDTO newUser)
        {
            await _userService.CreateNewUser(newUser);

            var user = await _userService.GetUserByUName(newUser.UserName);

            if (user == null)
            {
                return Unauthorized("User creation failed.");
            }

            var token = _tokenService.GenerateToken(user.UserId.ToString());

            return Ok(new
            {
                token
            });
        }

        [Authorize]
        [HttpGet("GetAllUsers")]

        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }


        [HttpPost("VerifyLoginAccount")]
        public async Task<IActionResult> VerifyLoginAccount(LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.UserName) || string.IsNullOrEmpty(loginDTO.UserPassword))
            {
                return BadRequest("Username and password are required.");
            }

            var user = await _userService.VerifyUserCredentials(loginDTO);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }
            var token = _tokenService.GenerateToken(user.UserId.ToString());

            return Ok(new
            {
                userName = user.UserName,
                token
            });
        }

    }
}

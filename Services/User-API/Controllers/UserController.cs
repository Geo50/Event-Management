using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Domain.Entities;
using Application.DTO;

namespace User_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly Application.Services.UserInfo _userService;

        public UserController(Application.Services.UserInfo userService)
        {
            _userService = userService;
        }

        [HttpPost("CreateNewUser")]

        public async Task<IActionResult> CreateNewUser(CreateUserDTO newUser)
        {
            await _userService.CreateNewUser(newUser);
            return Ok("Successfully created the new user");
        }

        [HttpGet("GetAllUsers")]

        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }


        [HttpPost("VerifyLoginAccount")]
        public async Task<IActionResult> VerifyLoginAccount( LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.UserName) || string.IsNullOrEmpty(loginDTO.UserPassword))
            {
                return BadRequest("Username and password are required.");
            }

            var user = await _userService.VerifyUserCredentials(loginDTO);

            if (user == null)
            {
                // User not found or invalid credentials
                return Unauthorized("Invalid username or password.");
            }

            // Generate authentication token or set cookies, etc.
            // For example:
            // var token = GenerateToken(user); // Implement this method as needed

            // Assuming you want to return user details or some success message
            return Ok(new
            {
                userName = user.UserName,
                password = user.UserPassword,
                email = user.UserEmail,
                id = user.UserId
            });
        }

    }
}

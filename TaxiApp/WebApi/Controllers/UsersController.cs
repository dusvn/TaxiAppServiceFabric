using Microsoft.AspNetCore.Mvc;
using Common.Models;
using Common.Enums;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Fabric;
using Common.Interfaces;
using Common.DTO;
using Common.Entities;
using System.Net;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using System.Runtime.InteropServices;
namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsersController : ControllerBase
    {

        private IConfiguration _config;
        
        public UsersController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> RegularRegister([FromForm] UserRegister userData)
        {
            if (string.IsNullOrEmpty(userData.Email) || !IsValidEmail(userData.Email)) return BadRequest("Invalid email format");
            if (string.IsNullOrEmpty(userData.Password)) return BadRequest("Password cannot be null or empty");
            if (string.IsNullOrEmpty(userData.Username)) return BadRequest("Username cannot be null or empty");
            if (string.IsNullOrEmpty(userData.FirstName)) return BadRequest("First name cannot be null or empty");
            if (string.IsNullOrEmpty(userData.LastName)) return BadRequest("Last name cannot be null or empty");
            if (string.IsNullOrEmpty(userData.Address)) return BadRequest("Address cannot be null or empty");
            if (string.IsNullOrEmpty(userData.TypeOfUser)) return BadRequest("Type of user must be selected!");
            if (string.IsNullOrEmpty(userData.Birthday)) return BadRequest("Birthday need to be selected!");
            if (userData.ImageUrl.Length == 0) return BadRequest("You need to send image while doing registration!");
            try
            {

                User userForRegister = new User(userData);

                var fabricClient = new FabricClient();
                bool result = false;

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    result = await proxy.addNewUser(userForRegister);
                }

                if (result)  return Ok($"Successfully registered new User: {userData.Username}"); 
                else return StatusCode(409, "User already exists in database!");
                

            }
            catch(Exception)
            {
                return StatusCode(500, "An error occurred while registering new User");
            }
        }

        [HttpGet]
        public async Task<List<FullUserDTO>> GetUsers()
        {

            try
            {
                var fabricClient = new FabricClient();
                var result = new List<FullUserDTO>();

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    var partitionResult = await proxy.listUsers();
                    result.AddRange(partitionResult);
                }

                return result;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"An error occurred: {ex.Message}");
                return new List<FullUserDTO>(); // Return an empty list or handle the error as needed
            }
        }
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginUserDTO user)
        {
            if (string.IsNullOrEmpty(user.Email) || !IsValidEmail(user.Email)) return BadRequest("Invalid email format");
            if (string.IsNullOrEmpty(user.Password)) return BadRequest("Password cannot be null or empty");

            try
            {
                var fabricClient = new FabricClient();
                LogedUserDTO result = null; // Initialize result to null

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    var partitionResult = await proxy.loginUser(user);

                    if (partitionResult != null)
                    {
                        result = partitionResult;
                        break;
                    }
                }

                if (result != null)
                {
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                    List<Claim> claims = new List<Claim>();
                    claims.Add(new Claim("MyCustomClaim",result.Roles.ToString()));

                    var Sectoken = new JwtSecurityToken(_config["Jwt:Issuer"],
                        _config["Jwt:Issuer"],
                        claims,
                        expires: DateTime.Now.AddMinutes(360),
                        signingCredentials: credentials);

                    var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                    var response = new
                    {
                        token = token,
                        user = result,
                        message = "Login successful"
                    };

                    return Ok(response);
                }
                else
                {
                    return BadRequest("Incorrect email or password");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while login User");
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllDrivers()
        {
            try
            {

                var fabricClient = new FabricClient();
                List<DriverViewDTO> result = null;

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    var parititonResult = await proxy.listDrivers();
                    if(parititonResult != null)
                    {
                        result = parititonResult;
                        break;
                    }
                    
                }

                if (result != null)
                {

                    var response = new
                    {
                        drivers = result,
                        message = "Succesfuly get list of drivers"
                    };
                    return Ok(response);
                }
                else
                {
                    return BadRequest("Incorrect email or password");
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering new User");
            }
        }


        [Authorize(Policy = "Admin")]
        [HttpPut]
        public async Task<IActionResult> ChangeDriverStatus([FromBody] DriverChangeStatusDTO driver)
        {
            try
            {

                var fabricClient = new FabricClient();
                bool result = false;

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    bool parititonResult = await proxy.changeDriverStatus(driver.Id, driver.Status);
                    result = parititonResult;
                }

                if (result) return Ok("Succesfuly changed driver status");
                
                else return BadRequest("Driver status is not changed");

            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering new User");
            }
        }


        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> ChangeUserFields([FromForm] UserForUpdate user)
        {
            UserForUpdateOverNetwork userForUpdate = new UserForUpdateOverNetwork(user);

            try
            {
                var fabricClient = new FabricClient();
                FullUserDTO result = null;

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    var proxyResult = await proxy.changeUserFields(userForUpdate);
                    if (proxyResult != null)
                    {
                        result = proxyResult;
                        break;
                    }
                }

                if (result != null)
                {
                    var response = new
                    {
                        changedUser = result,
                        message = "Succesfuly changed user fields!"
                    };
                    return Ok(response);
                }
                else return StatusCode(409, "User for change is not in db!");

            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating user");
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo([FromQuery] Guid id)
        {
            try
            {
                var fabricClient = new FabricClient();
                FullUserDTO result = null;

                var partitionList = await fabricClient.QueryManager.GetPartitionListAsync(new Uri("fabric:/TaxiApp/UsersService"));
                foreach (var partition in partitionList)
                {
                    var partitionKey = new ServicePartitionKey(((Int64RangePartitionInformation)partition.PartitionInformation).LowKey);
                    var proxy = ServiceProxy.Create<IUser>(new Uri("fabric:/TaxiApp/UsersService"), partitionKey);
                    var partitionResult = await proxy.GetUserInfo(id);
                    if (partitionResult != null)
                    {
                        result = partitionResult;
                        break;
                    }
                }

                if (result != null)
                {
                    var response = new
                    {
                        user = result,
                        message = "Successfully retrieved user info"
                    };
                    return Ok(response);
                }
                else
                {
                    return BadRequest("This id does not exist");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving user info");
            }
        }




        private bool IsValidEmail(string email)
        {
            const string pattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
            return Regex.IsMatch(email, pattern);
        }



    }
}

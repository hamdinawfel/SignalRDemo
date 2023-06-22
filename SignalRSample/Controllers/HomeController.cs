using Microsoft.AspNetCore.Mvc;
using SignalRSample.Constants;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Models;
using System.Diagnostics;
using SignalRSample.Hubs;
using System.Runtime.InteropServices;

namespace SignalRSample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHub;

        public HomeController(ILogger<HomeController> logger, IHubContext<DeathlyHallowsHub> deathlyHallowsHub)
        {
            _logger = logger;
            _deathlyHallowsHub = deathlyHallowsHub;
        }

        public IActionResult Index()
        {
            return View();
        } 
        
        public async Task<IActionResult> DeathlyHallows(string type)
        {
            if (StaticDetails.DeathlyHallowsRace.ContainsKey(type))
            {
                StaticDetails.DeathlyHallowsRace[type]++;
            }

            await _deathlyHallowsHub.Clients.All.SendAsync("updateDeathlyHallowsCount",
                StaticDetails.DeathlyHallowsRace[StaticDetails.Cloak],
                StaticDetails.DeathlyHallowsRace[StaticDetails.Stone],
                StaticDetails.DeathlyHallowsRace[StaticDetails.Wand]);

            return Accepted();
        }

        public IActionResult Notification()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
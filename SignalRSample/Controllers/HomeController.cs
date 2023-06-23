using Microsoft.AspNetCore.Mvc;
using SignalRSample.Constants;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Models;
using System.Diagnostics;
using SignalRSample.Hubs;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;

namespace SignalRSample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHub;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger,
                              IHubContext<DeathlyHallowsHub> deathlyHallowsHub,
                              ApplicationDbContext context)
        {
            _logger = logger;
            _deathlyHallowsHub = deathlyHallowsHub;
            _context = context;
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


        [ActionName("Order")]
        public async Task<IActionResult> Order()
        {
            string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
            string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

            Random rand = new Random();
            // Generate a random index less than the size of the array.  
            int index = rand.Next(name.Length);

            Order order = new Order()
            {
                Name = name[index],
                ItemName = itemName[index],
                Count = index
            };

            return View(order);
        }

        [ActionName("Order")]
        [HttpPost]
        public async Task<IActionResult> OrderPost(Order order)
        {

            _context.Order.Add(order);
            _context.SaveChanges();
            return RedirectToAction(nameof(Order));
        }
        [ActionName("OrderList")]
        public async Task<IActionResult> OrderList()
        {
            return View();
        }
        [HttpGet]
        public IActionResult GetAllOrder()
        {
            var productList = _context.Order.ToList();
            return Json(new { data = productList });
        }
    }
}
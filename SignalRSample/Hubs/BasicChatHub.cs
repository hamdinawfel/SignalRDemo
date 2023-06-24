using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class BasicChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        public BasicChatHub(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task SendPublicMessage(string sender, string message)
        {
            await Clients.All.SendAsync("onMessageRecieved", sender, message);

        }

        [Authorize]
        public async Task SendPrivateMessage(string sender, string receiver, string message)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email.ToLower() == receiver.ToLower());

            if (user != null)
            {
                await Clients.User(user.Id).SendAsync("onMessageRecieved", sender, message);

            }
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task NotifyWhenRoomJoined(string userId)
        {
            await Clients.All.SendAsync("sayHiToNewJoinedUser");

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                await Clients.User(user.Id).SendAsync("sayHiToNewJoinedUser", user.UserName);
                await Clients.AllExcept(Context.ConnectionId).SendAsync("notifyOthersForJoinedUser", user.UserName);
                //await Clients.Others.SendAsync("notifyOthersForJoinedUser", user.UserName);
            }
        }
    }
}

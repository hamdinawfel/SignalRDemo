using Microsoft.AspNetCore.SignalR;
using NuGet.Protocol.Plugins;
using SignalRSample.Data;
using SignalRSample.Hubs.Helpers;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
           var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("onReceiveUserConnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);

            }
                
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("onReceiveUserDisConnected", userName);
                HubConnections.RemoveUserConnection(userId, Context.ConnectionId);

            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task NotifyWhenRoomJoined(string userId)
        {
            await Clients.All.SendAsync("sayHiToNewJoinedUser");

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                await Clients.User(user.Id).SendAsync("sayHiToNewJoinedUser", user.UserName);
                await Clients.AllExcept(Context.ConnectionId).SendAsync("notifyOthersForJoinedUser", user.UserName);
                await Clients.Others.SendAsync("notifyOthersForJoinedUser", user.UserName);
            }
        }

        public async Task SendPublicMessage(string message)
        {
            await Clients.All.SendAsync("onSendPublicMessage", message);
        }
        
        public async Task SendPrivateMessage(string message, string userName)
        {
            await Clients.All.SendAsync("onSendPrivateMessage", message);

            var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == userName.ToLower());

            if (user != null)
            {
                await Clients.User(user.Id).SendAsync("onSendPrivateMessage", message);
            }
        }
    }
}

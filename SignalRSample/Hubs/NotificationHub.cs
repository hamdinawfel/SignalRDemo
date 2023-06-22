using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class NotificationHub : Hub
    {
        public static List<string>  Messages { get; set; } = new List<string>();
        public static int  Count { get; set; } = 0;

        public async Task SendNotification(string message)
        {
            Messages.Add(message);
            Count++;
            await Clients.All.SendAsync("onSubmitNotification", Messages, Count);
        }
    }
}

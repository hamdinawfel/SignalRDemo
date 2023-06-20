using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class HouseGroupHub : Hub
    {
        public static List<string> GroupsJoined { get; set; } = new List<string>();

        public async Task JoineHouse(string houseName)
        {
            var houseConnectionkey = $"{Context.ConnectionId}:{houseName}";
            if (!GroupsJoined.Contains(houseConnectionkey))
            {
               GroupsJoined.Add(houseConnectionkey);
               await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
               await Clients.Caller.SendAsync("onSubscribe", houseName);
               await Clients.Others.SendAsync("newMemberAddedInHouse", houseName);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            var houseConnectionkey = $"{Context.ConnectionId}:{houseName}";
            if (GroupsJoined.Contains(houseConnectionkey))
            {
                GroupsJoined.Remove(houseConnectionkey);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
                await Clients.Caller.SendAsync("onUnsubscribe", houseName);
                await Clients.Others.SendAsync("memberRemovedFromHouse", houseName);
            }
        }
        
        public async Task TriggerNotification(string houseName)
        {
             await Clients.OthersInGroup(houseName).SendAsync("onTriggerNotification", houseName);
        }
    }
}

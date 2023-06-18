using Microsoft.AspNetCore.SignalR;
using SignalRSample.Constants;

namespace SignalRSample.Hubs
{
    public class DeathlyHallowsHub : Hub
    {
        public Dictionary<string, int> GetDeathlyHallowsStatus()
        {
            return StaticDetails.DeathlyHallowsRace;
        }
    }
}

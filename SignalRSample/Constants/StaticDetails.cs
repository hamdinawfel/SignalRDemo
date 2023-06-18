using Microsoft.EntityFrameworkCore.Query.Internal;

namespace SignalRSample.Constants
{
    public static class StaticDetails
    {
        public static Dictionary<string, int> DeathlyHallowsRace;

        public const string Cloak = "cloak";
        public const string Stone = "stone";
        public const string Wand = "wand";

        static StaticDetails()
        {
            DeathlyHallowsRace = new Dictionary<string, int>();
            DeathlyHallowsRace.Add(Cloak, 0);
            DeathlyHallowsRace.Add(Stone, 0);
            DeathlyHallowsRace.Add(Wand, 0);
        }
    }
}

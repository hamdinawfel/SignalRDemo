namespace SignalRSample.Models.ViewModels
{
    public class ChatRoomDto
    {
        public ChatRoomDto()
        {
            Rooms = new List<ChatRoom>();
        }

        public int MaxRoomsAllowed { get; set; }
        public IList<ChatRoom> Rooms { get; set; }
        public string? UserId { get; set; }
        public bool AllowedAddRoom => Rooms == null || Rooms.Count < MaxRoomsAllowed;
    }
}

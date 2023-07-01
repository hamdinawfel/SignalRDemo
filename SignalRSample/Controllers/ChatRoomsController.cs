using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models;
using System.Security.Claims;

namespace SignalRSample.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ChatRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _chatHub;


        public ChatRoomsController(ApplicationDbContext context, IHubContext<ChatHub> chatHub)
        {
            _context = context;
            _chatHub = chatHub;

        }

        // GET: ChatRooms

        [HttpGet]
        [Route("/[controller]/GetChatRooms")]
        public async Task<ActionResult<IEnumerable<ChatRoom>>> GetChatRooms()
        {
            if (_context.ChatRoom == null)
            {
                return NotFound();
            }
            return await _context.ChatRoom.ToListAsync();
        }


        // GET: ChatUser

        [HttpGet]
        [Route("/[controller]/GetChatUser")]
        public async Task<ActionResult<Object>> GetChatUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var users = await _context.Users.ToListAsync();

            if (users == null)
            {
                return NotFound();
            }

            return users.Where(u => u.Id != userId).Select(u => new { Id = u.Id, UserName = u.UserName }).ToList();
        }


        // POST: ChatRooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("/[controller]/PostChatRoom")]
        public async Task<ActionResult<ChatRoom>> PostChatRoom(ChatRoom chatRoom)
        {
          if (_context.ChatRoom == null)
          {
              return Problem("Entity set 'ApplicationDbContext.ChatRoom'  is null.");
          }
            _context.ChatRoom.Add(chatRoom);
            await _context.SaveChangesAsync();
            await _chatHub.Clients.All.SendAsync("onRoomUpdated");
            return CreatedAtAction("GetChatRoom", new { id = chatRoom.Id }, chatRoom);
        }

        // DELETE: ChatRooms/5
        [HttpDelete("{id}")]
        [Route("/[controller]/DeleteChatRoom/{id}")]
        public async Task<IActionResult> DeleteChatRoom(int id)
        {
            if (_context.ChatRoom == null)
            {
                return NotFound();
            }
            var chatRoom = await _context.ChatRoom.FindAsync(id);
            if (chatRoom == null)
            {
                return NotFound();
            }

            _context.ChatRoom.Remove(chatRoom);
            await _context.SaveChangesAsync();
            await _chatHub.Clients.All.SendAsync("onRoomUpdated");
            return NoContent();
        }
    }
}

using API.Data.Repositories;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub(IMessageRepository messageRepository, IMemberRepository memberRepository,
                            IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["userId"].ToString() ?? throw new HubException("Otheruser not found");
            var groupName = GetGroupName(GetUserId(), otherUser);
            var messages = await messageRepository.GetMessageThread(GetUserId(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
            await AddToGroup(groupName);
        }

        public async Task SendMessage(CreateMessageDTO createMessageDTO)
        {
            var sender = await memberRepository.GetMemberByIdAsync(GetUserId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

            if (recipient is null || sender is null || sender.Id == createMessageDTO.RecipientId)
                throw new HubException("Cannot send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDTO.Content
            };

            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await messageRepository.GetMessageGroup(groupName);
            bool userInGroup = group != null && group.Connections.Any(x => x.UserId == message.RecipientId);

            if (userInGroup)
                message.DateRead = DateTime.UtcNow;

            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", message.ToDTO());
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);

                if (connections != null && connections.Count > 0 && !userInGroup) 
                {
                    await presenceHub.Clients.Clients(connections)
                                             .SendAsync("NewMessageReceived", message.ToDTO());
                }
            }            
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await messageRepository.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, GetUserId());

            if (group is null)
            {
                group = new Group(groupName);
                messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await messageRepository.SaveAllAsync();
        }

        private static string GetGroupName(string? caller, string other)
        {
            bool stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private string GetUserId()
        {
            return Context.User?.GetMemberId() ?? throw new HubException("Cannot get memberId");
        }
    }
}

using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController(IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var sender = await unitOfWork.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await unitOfWork.MemberRepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

            if (recipient is null || sender is null || sender.Id == createMessageDTO.RecipientId)
                return BadRequest("Cannot send this message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDTO.Content
            };

            unitOfWork.MessageRepository.AddMessage(message);

            if (await unitOfWork.Complete()) return Ok(message.ToDTO());
            
            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessageByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();
            return await unitOfWork.MessageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDTO>>> GetMessageThread(string recipientId)
        {
            var messages = await unitOfWork.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId);
            return Ok(messages);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.GetMemberId();

            var message = await unitOfWork.MessageRepository.GetMessage(id);

            if (message is null) return BadRequest("Cannot delete this message");

            if (message.SenderId != memberId && message.RecipientId != memberId)
                return BadRequest("You cannot delete this message");

            if (message.SenderId == memberId) message.SenderDeleted = true;
            if (message.RecipientId == memberId) message.RecipientDeleted = true;

            //pattern matching
            if (message is { SenderDeleted: true, RecipientDeleted: true })
                unitOfWork.MessageRepository.DeleteMessage(message);

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Problem to deleting the message");
        }
    }
}

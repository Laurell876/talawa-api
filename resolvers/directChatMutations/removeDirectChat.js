const User = require("../../models/User");
const DirectChat = require("../../models/DirectChat");
const authCheck = require("../functions/authCheck");
const adminCheck = require("../functions/adminCheck");
const organizationExists = require("../../helper_functions/organizationExists");
const DirectChatMessage = require("../../models/DirectChatMessage");

// admins of the organization can remove chats -- may change in the future

module.exports = async (parent, args, context, info) => {
  authCheck(context);

  const org = await organizationExists(args.organizationId);
  const chat = await DirectChat.findById(args.chatId);
  if (!chat) throw new Error("Chat not found");

  adminCheck(context, org);

  // delete all messages in the chat
  console.log(chat.messages);
  await DirectChatMessage.deleteMany({
    _id: {
      $in: [...chat.messages],
    },
  });

  delete chat
  await DirectChat.deleteOne({_id: args.chatId})

  return chat;
};
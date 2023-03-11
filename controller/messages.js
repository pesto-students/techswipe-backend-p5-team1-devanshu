const Message = require("../models/message");

const onMessage = async (data, socket, fromUserId, io) => {
  const { type } = data;
  console.log({ type });

  const limit = 0;
  const offset = 0;
  if (type === "Get Messages") {
    const messages = await Message.find({
      conversationId: data.conversationId,
    })
      .skip(offset)
      .limit(limit);
    // .sort({ timeStamp: -1 });

    socket.emit("getMessages", messages);
    // get user message based on userId's
  } else if (type === "Post Message") {
    // post message based on the data we receive
    const conversationId = data.conversationId;

    const message = await Message.create({
      conversationId,
      fromUserId: fromUserId,
      toUserId: data.toUserId,
      text: data.text,
      timeStamp: new Date(),
    });

    io.to(data.conversationId).emit("newMessage", message);
  } else {
    console.log("came to this condition");
  }
};

module.exports = { onMessage };

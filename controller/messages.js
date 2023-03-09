const Message = require("../models/message");

const onMessage = async (data) => {
  console.log(data);
  const { type } = data;
  if (type === "Get Message") {
    const fromUserId = data.fromUserId;
    // get user message based on userId's
  } else if (type === "Post Message") {
    // post message based on the data we receive

    const message = await Message.create({
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      text: data.text,
      timeStamp: new Date(),
    });

    console.log(message);
  }
};

module.exports = { onMessage };

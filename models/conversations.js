const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  fromUser: {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
  },
  toUser: {
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);

const exampleConversation = [
  {
    fromUserId: "640b091efe6ff8b91be41b07", // sridharaccount
    toUserId: "640b0941fe6ff8b91be41b12", // techswipe user account
  },
  {
    fromUserId: "640b091efe6ff8b91be41b07",
    toUserId: "640b0402c6215f423d7cbfec",
  },
  {
    fromUserId: "640b091efe6ff8b91be41b07",
    toUserId: "640b0402c6215f423d7cbfed",
  },
];

// 640b091efe6ff8b91be41b07

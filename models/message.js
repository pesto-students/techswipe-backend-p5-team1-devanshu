const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  conversationId: {
    type: String,
  },
  fromUserId: {
    type: String,
  },
  toUserId: {
    type: String,
  },
  text: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
  read: [
    {
      userId: {
        type: String,
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Message", messagesSchema);

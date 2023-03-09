const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  fromUserId: {
    type: String,
  },
  toUserId: {
    type: String,
  },
  text: {
    type: Array,
  },
  read: {
    type: Boolean,
  },
  timeStamp: {
    type: Date,
  },
});

module.exports = mongoose.model("Message", messagesSchema);

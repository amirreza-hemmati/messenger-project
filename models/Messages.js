const mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  type: { type: String, required: true, default: "string" },
  from_user: { type: Number, required: true, minLength: 10, maxLength: 10 },
  to_user: { type: Number, required: true, minLength: 10, maxLength: 10 },
  text: { type: String, required: true, trim: true },
  isRead: { type: Boolean, required: true, default: false },
  reply: { type: Boolean, required: true, default: false }
});

// plugin for time => { updatedAt and createdAt }
MessageSchema.plugin(timeStamps);

module.exports = model("Messages", MessageSchema);

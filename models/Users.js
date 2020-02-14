const mongoose = require('mongoose');
const timeStamps = require("mongoose-timestamp");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    user_id: { type: Number, required: true, unique: true, minlength: 10, maxlength: 10 },
    state: { type: Boolean, required: true, default: false }
});

// plugin for time => { updatedAt and createdAt }
UserSchema.plugin(timeStamps);

module.exports = model("Users", UserSchema);
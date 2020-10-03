const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const directChatMessageSchema = new Schema({
    directChatMessageBelongsTo: {
        type: Schema.Types.ObjectId,
        ref:"DirectChat",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: String,
        required: true,
    },
    messageContent: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("DirectChatMessage", directChatMessageSchema);
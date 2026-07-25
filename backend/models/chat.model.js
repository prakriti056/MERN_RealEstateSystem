import mongoose from "mongoose";
import Property from "./property.model.js";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        require: false
    },
    createAt: {
        type:Date,
        default:Date.now
    }
});

// chat  schema

const chatSchema = new mongoose.Schema({
    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: false

    },

    buyer:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [messageSchema],


},{
    timestamps: true
});

const Chat = mongoose.model("chat", chatSchema);
export default Chat;
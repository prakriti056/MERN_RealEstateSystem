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

const chartSchema = new mongoose.Schema({
    Property:{
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
    message: [messageSchema],


},{
    timestamps: true
});

const Chat = mongoose.model("chat", chartSchema);
export default Chat;
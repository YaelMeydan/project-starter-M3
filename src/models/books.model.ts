import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reviews: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
    }],
    createdAt: { type: Date, default: Date.now },
});

export const NewBook = model("NewBook", schema);
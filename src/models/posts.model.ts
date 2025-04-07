import { Schema, model } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
}, { timestamps: true });

export const Listing = model("Post", schema);

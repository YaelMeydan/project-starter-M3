import { Schema, model, Types } from "mongoose";


const schema = new Schema({
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
    bookCollection: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
}, { timestamps: true });

export const User = model("User", schema);
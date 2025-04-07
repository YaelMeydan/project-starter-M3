import express from "express";

export const router = express.Router();

router.get("/hello", (_, res) => {
    res.json({ message: "Hello World!" });
});

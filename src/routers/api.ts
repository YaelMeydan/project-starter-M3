import express from "express";
import { router as booksRouter } from "./books.router";
import { router as usersRouter } from "./users.router";

export const router = express.Router();

router.use("/users", usersRouter);
router.use("/books", booksRouter);


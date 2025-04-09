import path from "path";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { router as apiRouter } from "./routers/api";
import { User } from "./models/users.model";

export const app = express();

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use(json());
app.use(cookieParser(process.env.SESSION_SECRET));

app.all("/login", (req, res, next) => {
    if (req.signedCookies.userId) {
        res.redirect("/");
        return;
    }

    next();
});

app.post('/register', async ( req , res ) => {
    try {
        const { username, email, confirmEmail, password } = req.body;

        const NewUser = await User.create({
            email,
            password,
            username,
        });

        
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);


    
        res.cookie("userId", NewUser._id, {
            expires,
            signed: true,
            httpOnly: true,
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

   
    if (!username || !password) {
        res.status(401);
        res.send("Wrong credentials");
        return;
    }
    res.end();
});


app.post('/logout', (_req, res) => {
    res.clearCookie("userId");
    res.status(200).json({ message: 'Logout successful', redirect: '/' });
});

app.use("/api", apiRouter);
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use((req, res) => {
    if (!req.url.includes('404.html')) {
      res.redirect("404.html");
    } else {
      res.status(404).send("Not Found"); // Or handle it differently
    }
  });


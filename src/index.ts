import "dotenv/config";

import { createServer } from "http";
import mongoose from "mongoose";
import { app } from "./app";

const server = createServer(app);
const port = process.env.PORT || 8091;

async function init() {
    await mongoose.connect(process.env.CONNECTION_STRING!, {
        dbName: "intM3" ,
    });

    server.listen(port, () => console.log(`Server listening on port ${port}`));
}

init();

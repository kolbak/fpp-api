import express from "express";
import cors from "cors";
import config from "./config.json";

import fs from "fs";
import https from "https";

import MainRouter from "./routers/main.router";
import MintPassRouter from "./routers/mint-pass.router";
import TimerRouter from "./routers/timer.router";

const PORT: number = +process.env.PORT || config.PORT;
const HOST: string = process.env.HOST || config.HOST;

const app = express();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync("./etc/ssl/privkey.pem"),
        cert: fs.readFileSync("./etc/ssl/fullchain.pem"),
    },
    app
);

// =========== MIDDLEWARE ==============

app.use(express.json());
app.use(cors());

// =========== ROUTERS ==============

app.use("/api-mint-pass/", MintPassRouter);
app.use("/api/timer", TimerRouter);
app.use("/api", MainRouter);

// =========== ENDPOINTS ==============

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

// STARTING THE SERVER

if (process.env.NOTSSL) {
    app.listen(PORT, HOST, 0, () =>
        console.log(`Server has been succesfully started! on ${HOST}:${PORT}`)
    );
} else {
    httpsServer.listen(PORT, HOST, 0, () =>
        console.log(`Server has been succesfully started! on ${HOST}:${PORT}`)
    );
}

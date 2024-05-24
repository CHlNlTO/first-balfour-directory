import express from "express";
import next from "next";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(resolve(__dirname, "key.pem")),
  cert: fs.readFileSync(resolve(__dirname, "cert.pem")),
};

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
    return handle(req, res);
  });

  https.createServer(httpsOptions, server).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
});

const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIo = require("socket.io");
const cors = require("cors");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "https://my-app-psi-pearl.vercel.app",
  "http://localhost:3000",
];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const logFilePath = "log.txt";
let clients = [];

const sendUpdatesDebounced = _.debounce((socket, data) => {
  socket.emit("update", data);
}, 200);

function getLastLines(filePath, numLines) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").slice(-numLines);
  return lines;
}

function sendUpdates(socket, data) {
  sendUpdatesDebounced(socket, data);
}

function handleConnection(socket) {
  const lastLines = getLastLines(logFilePath, 10);
  sendUpdates(socket, lastLines);
  clients.push(socket);

  socket.on("disconnect", () => {
    clients = clients.filter((client) => client !== socket);
  });
}

function writeFile() {
  const randomLog = `${getRandomText()}\n`;
  fs.appendFileSync(logFilePath, randomLog);
}

function getRandomText() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomTextLength = Math.floor(Math.random() * (20 - 5 + 1) + 5);
  let randomText = "";

  for (let i = 0; i < randomTextLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
}

function scheduleRandomWrites() {
  const randomInterval = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);
  setTimeout(() => {
    writeFile();
    scheduleRandomWrites();
  }, randomInterval);
}

fs.watch(logFilePath, (eventType) => {
  if (eventType === "change") {
    const newLines = getLastLines(logFilePath, 2);
    const secondToLastLine = newLines.length === 2 ? newLines[0] : null;

    clients.forEach((client) => sendUpdates(client, [secondToLastLine]));
  }
});

io.on("connection", handleConnection);

scheduleRandomWrites();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

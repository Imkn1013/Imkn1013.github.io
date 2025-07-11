const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "https://imkn1013.github.io",
    methods: ["GET", "POST"]
  }
});

const socket = io('https://socket-server-sgat.onrender.com');
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Socket.IO server!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

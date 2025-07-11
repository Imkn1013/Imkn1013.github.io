const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://imkn1013.github.io", // クライアントのURLを指定
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// 動作確認用ルート
app.get("/", (req, res) => {
  res.send("Socket.IO server is running!");
});

// 現在参加中のルームを記録
const userRoom = {};
const chatHistory = {};

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // クライアントがルームに参加
  socket.on("joinRoom", (room) => {
    const roomid=`${room[0]}${room[1]}`;
    // ユーザーがすでに別のルームに参加しているか確認
    if (userRoom[socket.id]) {
      socket.emit("errorMessage", "すでにルームに入っています。先に退出してください。");
      return;
    }

    // ルームのメンバー数を確認
    const clientsInRoom = io.sockets.adapter.rooms.get(roomid) || new Set();
    if (clientsInRoom.size >= room[1]) {
      socket.emit("errorMessage", "ルームは満員です。");
      return;
    }

    // ルームに参加
    socket.join(roomid);
    userRoom[socket.id] = roomid;
    
    if (!chatHistory[roomid]) {
      chatHistory[roomid] = [];
    }
    socket.emit("chatHistory", chatHistory[roomid]);

    console.log(`${socket.id} joined room: ${roomid}`);
    io.to(roomid).emit("roomMessage", {
        room,
        message: `${socket.id}が参加しました。`,
      });
    

    // ルーム内のクライアントリストを取得
    const updatedClientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomid) || []);
    console.log(`Clients in room ${room}:`, updatedClientsInRoom);

    // クライアントにルームのメンバー一覧を送信
    io.to(roomid).emit("roomMembers", { roomid, members: updatedClientsInRoom });
  });

  // クライアントがルームからメッセージを送信
  socket.on("sendMessageToRoom", ({ room, message }) => {
    const roomid=`${room[0]}${room[1]}`;
    if (!chatHistory[roomid]) {
      chatHistory[roomid] = [];
    }

    const formattedMessage = `${socket.id}: ${message}`;
    chatHistory[roomid].push(formattedMessage); // チャット履歴に追加
    
    io.to(roomid).emit("roomMessage", {
      room,
      message: `${socket.id}: ${message}`,
    });
  });

  // クライアントがルームを退出
  socket.on("leaveRoom", () => {
    const room = userRoom[socket.id];
    if (room) {
      socket.leave(room);
      delete userRoom[socket.id];

      // 退出したことをルームに通知
      io.to(room).emit("roomMessage", {
        room,
        message: `${socket.id}が退出しました。`,
      });

      // 更新されたルームのメンバーリストを送信
      const updatedClientsInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []);
      io.to(room).emit("roomMembers", { room, members: updatedClientsInRoom });
    } else {
      socket.emit("errorMessage", "You are not in any room.");
    }
  });

  // クライアントが切断
  socket.on("disconnect", () => {
    const room = userRoom[socket.id];
    if (room) {
      delete userRoom[socket.id];
      // 切断したことをルームに通知
      socket.to(room).emit("roomMessage", {
        room,
        message: `${socket.id}が切断されました。`,
      });

      // ルームリストを更新
      const updatedClientsInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []);
      io.to(room).emit("roomMembers", { room, members: updatedClientsInRoom });
    }
  });
  
  socket.on("sanma_open",function(){
    const room = userRoom[socket.id];
    const clientsInRoom = io.sockets.adapter.rooms.get(room) || new Set();
    if (clientsInRoom.size !== 3) {
      socket.emit("errorMessage", "その人数ではできません。");
      return;
    }
    
    let mount = [];
    let allpi = ["1s", "2s", "3s", "4s", "6s", "7s", "8s", "9s",
                 "1p", "2p", "3p", "4p", "6p", "7p", "8p", "9p",
                 "1m", "2m", "3m", "4m", "6m", "7m", "8m", "9m",
                 "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
    // 配列を4倍にする（麻雀牌は各種類が4枚ずつあるため）
    allpi = allpi.concat(allpi, allpi, allpi);
    allpi.push("5m","5m","5m","5md","5p","5p","5p","5pd","5s","5s","5s","5sd");
    let times = 0;
    let ran;
    while (allpi.length > 0) {
      ran = Math.floor(Math.random() * (136 - times));
      mount.push(allpi[ran]);
      allpi.splice(ran, 1);
      times++;
    }

    io.to(room).emit("sanma_start");
    io.to(room).emit("haipai",mount);
  });
  
  socket.on("syogi_open1",function(){
    const id=socket.id;
    
    const room = userRoom[id];
    const clientsInRoom = io.sockets.adapter.rooms.get(room) || new Set();
    if (clientsInRoom.size !== 2) {
      socket.emit("errorMessage", "その人数ではできません。");
      return;
    }
    io.to(room).emit("syogi_start1",id);
  });
  socket.on("syogi_open2",function(){
    const id1=socket.id;
    const room = userRoom[id1];
    io.to(room).emit("syogi_start2",id1);
  });
  socket.on("field",function(data){
    const room = userRoom[socket.id];
    const updatedClientsInRoom = Array.from(io.sockets.adapter.rooms.get(room) || []);
      for(let i=0;i<2;i++){
       if(updatedClientsInRoom[i]!==socket.id){
       io.to(updatedClientsInRoom[i]).emit("field",data);
       }
      }
    });
});


// サーバーを起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

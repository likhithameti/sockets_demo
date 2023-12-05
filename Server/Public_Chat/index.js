var express = require('express');
var app = express();
var http = require("http").Server(app);
const io = require('socket.io')(http, {
    cors: {
      origin: '*', // Replace with your React app's URL
      methods: ['GET', 'POST'],
    }
  });
  
const port = 4300;

app.get("/",(req,res)=>{
    res.send("Welcome to socket demo")
})

// Establish connection
io.on("connection", (socket)=>{
    console.log("Connection Established");

    socket.on("join_chat",(details)=>{
        
        socket.user = details;

        socket.emit("join_message",`Welcome ${details.name} to the chat. Send your first message`);

        // Send message to all the clients except this client
        socket.broadcast.emit("join_message",`${details.name} joined the chat`);
    })

    socket.on("send_message", (message)=>{

        socket.emit("message_sent","Message Sent successfully");

        socket.broadcast.emit("send_message",`${message.name} send a message. ${message.message}`);
    })

    socket.on("typing", () => {
        const name = socket.user.name;
        socket.broadcast.emit("typing", `${name} is typing`);
      });
    
    socket.on("stopped_typing", () => {
        socket.broadcast.emit("stopped_typing");
    });

    socket.on("disconnect",()=>{

        const { user } = socket;

        if (user) {
          socket.broadcast.emit("left_message", `${user.name} left the chat`);
        }

        console.log("Disconneced");
    })
})


http.listen(port,function(){
    console.log(`Listening on port ${port}`);
})
var express = require('express');
var app = express();
var http = require("http").Server(app);
var io = require('socket.io')(http);
const port = 3000;

app.get("/", (req,res,next)=>{
    res.sendFile(__dirname+"/index.html");
})

const connectedClients = []

const getAllVisitors = () =>{
    const usersDetails = connectedClients.length > 0 ? connectedClients.map(client => client.user) : [];
    console.log("user details",usersDetails);
    return usersDetails;
}

io.on("connection", (socket)=>{
    console.log("A User Connected");
    connectedClients.push(socket); // push current socket

    // Emit the initial list of visitors when a new user connects (emitted to person who is newly connected, not for all)
    // Once emitted, client read it and then its done.
    socket.emit("visitors", getAllVisitors());

    // Listening to new event - New Visitors
    socket.on("new_visitor", (user) =>{
        console.log("New visitor", user);
        socket.user = user; // current user information binding

        io.emit("visitors", getAllVisitors()); // emit to all clients
        // if we use socket.emit, who triggered the event they only get the updated list
    })
    socket.on("disconnect", (socket)=>{
        console.log("A user disconnected");
        connectedClients.pop(socket);
        io.emit("visitors", getAllVisitors()); // When someone disconnects we need to update the list
    });
})

http.listen(port,function(){
    console.log(`Listening on port ${port}`);
})
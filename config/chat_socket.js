//server side or observer side
module.exports.chatSockets = function (socketServer) {
  const io = require("socket.io")(socketServer, {
    //required to be specifiedd after v3
    cors: {
      origin: "http://54.79.162.128:8000"
    }
  });

  io.sockets.on('connection', function (socket) {
    console.log("New connection established on socket.io:", socket.id)

    socket.on('disconnect', function () {
      console.log('socket.io disconnected');
    })
    socket.on('join_room', function (data) {
      console.log('joining request recieved', data);
      socket.join(data.chatroom);
      io.in(data.chatroom).emit('user_joined', data);
    })

    //upon receiving a message
    socket.on('send_message', function (data) {
      io.in(data.chatroom).emit('receive_message', data);
    });
  });
}
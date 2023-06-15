//server side or observer side
module.exports.chatSockets = function(socketServer){
    const io = require("socket.io")(socketServer, {
        //required to be specifiedd after v3
        cors: {
          origin: "http://localhost:8000"
        }
      });

    io.sockets.on('connection', function(socket){
        console.log("New connection established on socket.io:", socket.id)
    });

}
//user side or subscriberside
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        //handling event 'connect' on socket
        this.socket.on('connect', function(){
            console.log('connection established using sockets')
        })
    }
}
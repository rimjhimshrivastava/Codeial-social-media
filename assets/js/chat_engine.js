//user side or subscriberside
class ChatEngine {
    constructor(chatBoxId, userEmail, userName) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;
        this.socket = io.connect('http://54.79.162.128:5000');
        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;


        //handling event 'connect' on socket
        this.socket.on('connect', function () {
            console.log('connection established using sockets')
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                user_name: self.userName,
                chatroom: 'codeial'
            })
        });

        self.socket.on('user_joined', function (data) {
            console.log('a user joined!', data);
        });

        //send a message by clicking on the send button
        $('#send-message').submit(function(e) {
            e.preventDefault();
            let msg = $('.message').val();
            if (msg != '') {
                $('.message').val('');
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom: 'codeial'
                })
            }
        })
        //upon receiving a message
        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            let newMessage = $('<li>');

            let messageType = 'friend_text';
            
            if(data.user_email == self.userEmail){
                messageType = 'user_text';
            };

            newMessage.append($('<span>', {
                'html': data.user_name
            }).addClass('sender_name'));
            newMessage.append($('<span>', {
                'html': data.message
            }).addClass('text_message'));

            newMessage.addClass(messageType);
            $('#chat-messages-list').append(newMessage);
        })
    }
}
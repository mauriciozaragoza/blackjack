/**
 * Created by Mauricio on 4/21/2015.
 */

module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('aaaaa');

        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
        });
    });
};
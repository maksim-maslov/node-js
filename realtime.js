'use strict';

const io = require('socket.io');

exports.socketIO = function(server) {

  const socketIO = io.listen(server);

  socketIO.on('connection', function(socket) {

    console.log('User connected');

    socket.on('changeStatus', order => socketIO.emit('changeStatus', order));

    socket.on('disconnect', message => console.log('User left'));

  });

  return socketIO;

}

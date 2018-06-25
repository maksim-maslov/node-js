'use strict';

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {

    console.log('User connected');

    socket.on('changeStatus', order => io.emit('changeStatus', order));

    socket.on('disconnect', message => console.log('User left'));

  });
  
};


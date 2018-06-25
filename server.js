'use strict';

const routes = require('./route');
const realtime = require('./realtime');

const express = require('express');
const sio = require('socket.io');

const app = express();
const http = require('http');
const server = http.createServer(app);

const io = sio.listen(server);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/'));

// app.use('/api', router);

routes(app, io);

realtime(io);

server.listen(port, () => console.log(`Application started on port ${port}!`));



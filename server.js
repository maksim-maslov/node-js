'use strict';

const routes = require('./route');
const realtime = require('./realtime');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 3002;

app.use(express.static(__dirname + '/'));

routes(app);

server.listen(port, () => console.log(`Application started on port ${port}!`));

exports.socketIO = realtime.socketIO(server);

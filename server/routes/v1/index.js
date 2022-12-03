var express = require('express');
var server = express();

server.use('/user', require('./user'));
server.use('/car', require('./car'));
server.use('/pickupStation' , require('./pickupStation'));
server.use('/payment',require('./payment'));


module.exports = server;
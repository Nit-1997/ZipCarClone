var express = require('express');
var server = express();

server.use('/user', require('./user'));

module.exports = server;
const express = require('express');
const server = express();

const router = express.Router();

//const functions = require('functions');
const controllers = require('../../controllers/index.js');
const userController = controllers.user;

router.route('/create')
    .post(userController.create);

router.route('/getAll')
    .get(userController.getAll);

server.use('/', router);

module.exports = server;
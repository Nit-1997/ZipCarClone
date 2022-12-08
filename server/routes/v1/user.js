const express = require('express');
const server = express();


const router = express.Router();

//const functions = require('functions');
const controllers = require('../../controllers/index.js');
const userController = controllers.user;

router.route('/signup')
    .get(userController.signup);

router.route('/login')
    .get(userController.login);

router.route('/getAll')
    .get(userController.getAll);

router.route('/showAllOrders')
    .get(userController.showAllOrders);

router.route('/testSP')
    .post(userController.create);
server.use('/', router);

module.exports = server;
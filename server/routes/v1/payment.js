const express = require('express');
const server = express();


const router = express.Router();

const controllers = require('../../controllers/index.js');
const paymentController = controllers.payment;

router.route('/payment')
    .get(paymentController.makePayment);



server.use('/', router);

module.exports = server;
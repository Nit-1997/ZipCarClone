const express = require('express');
const server = express();


const router = express.Router();

const controllers = require('../../controllers/index.js');
const pickupStationController = controllers.pickupStation;

router.route('/bulkInsert')
    .post(pickupStationController.bulkInsert);



server.use('/', router);

module.exports = server;
const express = require('express');
const server = express();


const router = express.Router();

const controllers = require('../../controllers/index.js');
const carController = controllers.car;

router.route('/cars')
    .get(carController.showCars);

router.route('/getAllCars')
    .get(carController.getAllCars);

router.route('/createCar')
    .post(carController.createCar);

router.route('/createCar')
    .get(carController.createCarUI);


server.use('/', router);

module.exports = server;
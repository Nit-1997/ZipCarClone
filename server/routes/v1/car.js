const express = require('express');
const server = express();


const router = express.Router();

const controllers = require('../../controllers/index.js');
const {car} = require("../../controllers");
const carController = controllers.car;

router.route('/cars')
    .get(carController.showCars);

router.route('/getAllCars')
    .get(carController.getAllCars);

router.route('/createCar')
    .post(carController.createCar);

router.route('/createCar')
    .get(carController.createCarUI);

router.route('/edit')
    .get(carController.editCar);

router.route('/updateCar')
    .post(carController.updateCar);

router.route('/delete')
    .post(carController.deleteCar);

router.route('/:id')
    .get(carController.showSingleCar);


server.use('/', router);

module.exports = server;
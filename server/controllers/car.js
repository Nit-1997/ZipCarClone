const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const e = require("express");
const car = models.car;
const inventory = models.inventory;
const pickupStation = models.pickupStation;
const sequelize = models.sequelize;

module.exports = {

    showCars: async (req, res) => {
        try {
            if (!req.user) {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let cars = await sequelize.query('CALL showAvailableCars()');
            let noMatch = "No cars Found"
            if (cars.length > 0) {
                noMatch = null;
            }
            res.render('allCars', {cars: cars, noMatch: noMatch});
        } catch (error) {
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }
    },


    /**
     * Creates the Car and inserts it into DB.
     * Syncs the inventory as well based on the pickupStation at the given zipcode.
     * @param req request
     * @param res response
     * @returns {Promise<void>} json response
     */
    createCar: async (req, res) => {
        try {
            if (req.user === undefined || req.user.type === "client") {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let car = await sequelize.query('CALL createCar(:userId,:type,:name,:make,:fuelType,:rentalRate,:zipcode)',
                {
                    replacements:
                        {
                            userId: req.user.id,
                            type: req.body.type,
                            name: req.body.name,
                            make: req.body.make,
                            fuelType: req.body.fuelType,
                            rentalRate: req.body.rentalRate,
                            zipcode: req.body.zipcode
                        }
                });
            console.log(car);
            req.flash("success", req.user.name + ", your Car has been created Successfully:)");
            res.redirect('/car/cars');

        } catch (error) {
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }
    },

    createCarUI: async (req, res) => {
        try {
            if (!req.user || req.user.type === "client") {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            res.render('createCar');
        } catch (error) {
            console.log(error);
        }
    },

    showSingleCar: async (req, res) => {
        try{
            if (!req.user) {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let car = await sequelize.query('CALL findCarById (:id)',
                {
                    replacements:
                        {
                            id: req.params.id
                        }
                });

            res.render('singleCar', {car: car[0]})
        }catch (error){
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }
    },

    editCar: async (req, res) => {
        try{
            if (!req.user) {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let car = await sequelize.query('CALL findCarById (:id)',
                {
                    replacements:
                        {
                            id: req.query.carId
                        }
                });
            car = car[0];
            res.render('editCar', {car: car});
        }catch (error){
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }
    },

    updateCar: async (req, res) => {
        try {

            if (!req.user || req.user.type === "client") {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }

            let car = await sequelize.query('CALL updateCar(:carId,:type,:name,:make,:fuelType,:rentalRate,:zipcode)',
                {
                    replacements:
                        {
                            carId: req.body.id,
                            type: req.body.type,
                            name: req.body.name,
                            make: req.body.make,
                            fuelType: req.body.fuelType,
                            rentalRate: req.body.rentalRate,
                            zipcode: req.body.zipcode
                        }
                });

            req.flash("success", req.user.name + ", your Car has been updated Successfully:)");
            res.redirect('/car/' + req.body.id);

        } catch (error) {
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }
    },

    deleteCar: async (req, res) => {
        try{
            let car = await sequelize.query('CALL  deleteCarByID (:id)',
                {
                    replacements:
                        {
                            id: req.query.carId
                        }
                });
            req.flash("success", req.user.name + ", your Car has been deleted Successfully:)");
            res.redirect('/car/cars');
        }catch(error){
            if (error.original) {
                let msg = error.original.sqlMessage;
                req.flash("error" , msg);
            } else {
                console.log(error);
                req.flash("error" , "Unexpected server failure")
            }
        }

    }


}
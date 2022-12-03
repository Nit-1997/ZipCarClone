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

    showCars: async function (req, res) {
        try {
            if(!req.user){
                res.sendStatus(401);
            }
            // CALL getCars()
            let cars = await sequelize.query("select * from cars", {type: sequelize.QueryTypes.SELECT});
            let noMatch = "No cars Found"
            if(cars.length > 0){
                noMatch = null;
            }
            res.render('allCars',{cars: cars ,noMatch:noMatch});
        } catch (error) {
            console.log(error);
        }
    },

    getAllCars: async  (req, res) => {
        try {
            let cars = await sequelize.query("select * from cars", {type: sequelize.QueryTypes.SELECT});
            let noMatch = "No cars Found"
            if(cars.length > 0){
                noMatch = null;
            }
            res.render('allCars',{cars: cars ,noMatch:noMatch});
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Creates the Car and inserts it into DB.
     * Syncs the inventory as well based on the pickupStation at the given zipcode.
     * @param req request
     * @param res response
     * @returns {Promise<void>} json response
     */
    createCar: async (req , res) => {
        try{
            if(req.user === undefined || req.user.type === "client"){
                res.sendStatus(401);
                return;
            }


            // CALL  findPickupStation(zipcode)

            //finds the id for the pickupStation
            let pickupStationGotten = await pickupStation.findOne(
                {
                    where: {
                        zipcode : req.body.zipcode
                    }
                }
            )

            if(!pickupStationGotten){
                res.json("Invalid ZipCode");
                return;
            }

            let data = {
                    userId : req.user.id,
                    type : req.body.type,
                    name : req.body.name,
                    make : req.body.make,
                    fuelType : req.body.fuelType,
                    rentalRate : req.body.rentalRate,
                    createdAt : Date.now()
            };

            // Call createCar(userId ,,......)
            // INSERT INTO ...

            let newlyCreatedCar = await car.create(data);

            let inventoryData = {
                zipcode : req.body.zipcode,
                status : "AVAILABLE",
                carId : newlyCreatedCar.dataValues.id,
                pickupStationId : pickupStationGotten.dataValues.id,
                createdAt: Date.now()
            }

            // call createInventory(zipcode .. ..)

            let newlyCreatedInventory = await inventory.create(inventoryData);

            res.redirect('/car/cars');

        } catch (error) {
            console.log(error);
        }
    },

    createCarUI : async (req , res) => {
        try{
            res.render('createCar');
        }catch(error){
            console.log(error);
        }
    }




}
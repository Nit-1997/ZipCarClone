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
            let cars = await sequelize.query("select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as inventoryId, inventories.zipcode ,pickupStationId , address  from cars join inventories on cars.id = inventories.carId join pickupStations on pickupStations.id = inventories.pickupStationId where status = \"AVAILABLE\";", {type: sequelize.QueryTypes.SELECT});
            console.log(cars);
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
            console.log(cars)
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
            req.flash("success",req.user.name+", your Car has been created Successfully:)");
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
    },

    showSingleCar : async (req,res) => {
        let car = await sequelize.query("select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as inventoryId, inventories.zipcode ,pickupStationId , address  from cars join inventories on cars.id = inventories.carId join pickupStations on pickupStations.id = inventories.pickupStationId where status = \"AVAILABLE\" and cars.id ="+req.params.id+";", {type: sequelize.QueryTypes.SELECT});
        res.render('singleCar',{car:car[0]})
    },

    editCar : async (req,res) => {
        if(!req.user){
            await res.sendStatus(401);
            return;
        }
        let car = await sequelize.query("select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as inventoryId, inventories.zipcode ,pickupStationId , address  from cars join inventories on cars.id = inventories.carId join pickupStations on pickupStations.id = inventories.pickupStationId where status = \"AVAILABLE\" and cars.id ="+req.query.carId+";", {type: sequelize.QueryTypes.SELECT});
        car = car[0];
        console.log(car);
        res.render('editCar',{car : car});
    },

    updateCar : async (req,res) => {
        try{
            // if(req.user === undefined || req.user.type === "client"){
            //     res.sendStatus(401);
            //     return;
            // }


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
                type : req.body.type,
                name : req.body.name,
                make : req.body.make,
                fuelType : req.body.fuelType,
                rentalRate : req.body.rentalRate
            };

            // Call createCar(userId ,,......)
            // INSERT INTO ...

            let updatedCar = await car.update(data ,  {where : {id : req.body.id}});

            let inventoryData = {
                zipcode : req.body.zipcode,
                pickupStationId : pickupStationGotten.dataValues.id,
            }

            // call createInventory(zipcode .. ..)

            let newlyCreatedInventory = await inventory.update(inventoryData ,  {where : {carId :req.body.id}});
            req.flash("success",req.user.name+", your Car has been updated Successfully:)");
            res.redirect('/car/'+req.body.id);

        } catch (error) {
            console.log(error);
        }
    },

    deleteCar: async (req,res) => {
        await sequelize.query("delete from cars where id ="+req.query.carId, {type: sequelize.QueryTypes.DELETE});
        req.flash("success",req.user.name+", your Car has been deleted Successfully:)");
        res.redirect('/');
    }





}
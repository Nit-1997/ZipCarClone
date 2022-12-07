const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const user = models.user;
const leaseOrder = models.leaseOrder;
const payment = models.payment;
const inventory = models.inventory;
const sequelize = models.sequelize;

module.exports = {
    makePayment: async function (req, res) {
        try {

            if(!req.user){
                await res.sendStatus(401);
                return;
            }
            // make a procedure registerOrder()
            //get the data required to
            // create a payment
            // create a lease order
            let car = await sequelize.query("select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as inventoryId, inventories.zipcode ,pickupStationId , address  from cars join inventories on cars.id = inventories.carId join pickupStations on pickupStations.id = inventories.pickupStationId where status = \"AVAILABLE\" and cars.id ="+req.body.carId+";", {type: sequelize.QueryTypes.SELECT});
            car = car[0];
            console.log(car);
            let leaseOrderData = {
              status : "completed",
              createdAt : req.body.dated,
              userId : req.user.id,
              inventoryId : car.inventoryId
            }

            let newlyCreatedLeaseOrder = await leaseOrder.create(leaseOrderData);

            let paymentData = {
                state : "SUCCESS",
                createdAt: Date.now(),
                leaseOrderId : newlyCreatedLeaseOrder.dataValues.id,
                userId: req.user.id
            }

            let newlyCreatedPayment = await payment.create(paymentData);

            let updatedInventoryData = {
                status : "BOOKED"
            }
            let updatedInventory  = await inventory.update( updatedInventoryData, {where : {id : car.inventoryId}});
            req.flash("success",req.user.name+", your Booking has been Successfully added:)");
            res.redirect('/user/showAllOrders');
        } catch (error) {
            console.log(error);
        }
    }

}
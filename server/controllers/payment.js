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

            if (!req.user) {
                req.flash("error", "You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let createdTransaction = await sequelize.query('CALL createOrder (:date, :carId , :userId)',
                {
                    replacements:
                        {
                            date: req.body.dated,
                            carId: req.body.carId,
                            userId: req.user.id

                        }
                });
            req.flash("success", req.user.name + ", your Booking has been Successfully added:)");
            res.redirect('/user/showAllOrders');
        } catch (error) {
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
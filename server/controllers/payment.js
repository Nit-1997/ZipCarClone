const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const user = models.user;
const sequelize = models.sequelize;

module.exports = {
    makePayment: async function (req, res) {
        try {
            // write code to create a user here.
            res.render('razorpay');

        } catch (error) {
            console.log(error);
        }
    }

}
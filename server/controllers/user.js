const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const user = models.user;
const sequelize = models.sequelize;

module.exports = {
    login: async function (req, res) {
        try {
            res.render('login');
        } catch (error) {
            console.log(error);
        }
    },

    signup: async (req, res) => {
        try {
            res.render('signup');
        } catch (error) {
            console.log(error);
        }
    },

    showAllOrders: async (req, res) => {
        try {
            if(!req.user){
                req.flash("error","You need to be Logged In");
                res.redirect('/user/login');
                return;
            }

            let orders = await sequelize.query('CALL showAllOrders (:userId)',
                {
                    replacements:
                        {
                            userId: req.user.id
                        }
                });
            let noMatch = "No Orders Found"
            if (orders.length > 0) {
                noMatch = null;
            }
            res.render('allOrders', {cars: orders, noMatch: noMatch});
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
const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const user = models.user;
const sequelize = models.sequelize;

module.exports = {
    create: async function (req, res) {
        try {
            // write code to create a user here.
            let users = await sequelize.query('CALL login (:email, :pwd)',
                {
                    replacements:
                        {
                            email: "ntnbhat@gmail.com",
                            pwd: '$2a$08$78fjxFr6G2Xn6n6.UsXJmOXQsqFw6thgrFs.033KXvVutlggKzpKy'
                        }
                });



            console.log(users[0]);

            res.json(users[0]);

        } catch (error) {
            console.log(error);
        }
    },

    getAll: async function (req, res) {
        try {
            // write code to create a user here.
            let users = await sequelize.query("select * from users", {type: sequelize.QueryTypes.SELECT});
            res.send(users);

        } catch (error) {
            console.log(error);
        }
    },

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
            // let orders = await sequelize.query("select leaseOrders.id as leaseOrderId, cars.name, cars.make, cars.fuelType , cars.rentalRate ,\n" +
            //     "cars.type, payments.state as paymentStatus , leaseOrders.status as orderStatus  , leaseOrders.createdAt as orderDate\n" +
            //     "from leaseOrders \n" +
            //     "join payments on leaseOrders.id = payments.leaseOrderId \n" +
            //     "join inventories on leaseOrders.inventoryId = inventories.id\n" +
            //     "join cars on cars.id = inventories.id\n" +
            //     "where leaseOrders.userId = " + req.user.id + ";", {type: sequelize.QueryTypes.SELECT});

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
            console.log(error);
        }
    }


}
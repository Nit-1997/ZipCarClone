const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const {cp850} = require("mysql2/lib/constants/encoding_charset");
const user = models.user;
const incident = models.incidents;
const sequelize = models.sequelize;

module.exports = {
    create: async function (req, res) {
        try {
            // write code to create a user here.

            console.log(req.body);

            let data = {
                title: req.body.title,
                description: req.body.description,
                severity: req.body.severity,
                leaseOrderId: req.body.leaseOrderId,
                state: "RAISED",
                createdAt: Date.now(),
                userId: req.user.id,
                resolution: ""
            };

            let newlyCreatedIncident = await incident.create(data);

            console.log(newlyCreatedIncident);
            res.redirect('/');

        } catch (error) {
            console.log(error);
        }
    },

    getAll: async function (req, res) {
        try {
            // write code to create a user here.
            let cars = await sequelize.query("select * from incidents  where userId = " + req.user.id + " and leaseOrderId = "+req.body.leaseOrderId+";", {type: sequelize.QueryTypes.SELECT});
            let noMatch = "No cars Found";
            if(cars.length > 0){
                noMatch = null;
            }
            console.log(cars)
            res.render('allIncidents',{cars: cars ,noMatch:noMatch});

        } catch (error) {
            console.log(error);
        }
    },
    showIncidentPage: async (req, res) => {
        try {
            if (!req.user) {
                await res.sendStatus(401);
                return;
            }
            console.log(req.body)
            res.render('createIncident', {leaseOrderId: req.body.leaseOrderId});
        } catch (error) {
            console.log(error);
        }
    },
    resolveIncident: async (req, res) => {
        try {
            if (!req.user) {
                await res.sendStatus(401);
                return;
            }
            console.log("**********************************")
            console.log(req.body);

            let data = {
                resolution : req.body.resolution,
                state : "RESOLVED",
            }

            let updatedIncident  = await incident.update( data, {where : {id : req.body.incidentId}});
            console.log(updatedIncident);
            res.redirect('/user/showAllOrders');
        } catch (error) {
            console.log(error);
        }
    }

}
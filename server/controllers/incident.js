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
            if(!req.user){
                req.flash("error","You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let newlyCreated = await sequelize.query('CALL createIncident (:title, :description , :severity , :leaseOrderId , :userId)',
                {
                    replacements:
                        {
                            title: req.body.title,
                            description: req.body.description,
                            severity: req.body.severity,
                            leaseOrderId: req.body.leaseOrderId,
                            userId: req.user.id
                        }
                });
            newlyCreated  = newlyCreated[0];
            req.flash("success","Created incident successfully");
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
    },

    getAll: async function (req, res) {
        try {
            if(!req.user){
                req.flash("error","You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let cars = await sequelize.query('CALL getAllIncidents (:userId, :leaseId)',
                {
                    replacements:
                        {
                            userId:  req.user.id,
                            leaseId: req.body.leaseOrderId
                        }
                });

            let noMatch = "No Incidents Found";
            if(cars.length > 0){
                noMatch = null;
            }
            res.render('allIncidents',{cars: cars ,noMatch:noMatch});

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
    showIncidentPage: async (req, res) => {
        try {
            if(!req.user){
                req.flash("error","You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            res.render('createIncident', {leaseOrderId: req.body.leaseOrderId});
        } catch (error) {
            console.log(error);
        }
    },
    resolveIncident: async (req, res) => {
        try {
            if(!req.user){
                req.flash("error","You need to be Logged In");
                res.redirect('/user/login');
                return;
            }
            let updatedIncident = await sequelize.query('CALL resolveIncident (:resolution, :id)',
                {
                    replacements:
                        {
                            resolution:  req.body.resolution,
                            id: req.body.incidentId,
                        }
                });
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
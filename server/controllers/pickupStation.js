const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const e = require("express");
const pickupStaion = models.pickupStation;
const sequelize = models.sequelize;

module.exports = {

    bulkInsert: async function (req, res) {
        try {
            let pickupStationData = [
                {
                    zipcode : "201005",
                    address : "Boylston st",
                    createdAt : Date.now()
                },
                {
                    zipcode : "201006",
                    address : "Beacon st",
                    createdAt :  Date.now()
                },
                {
                    zipcode : "201007",
                    address : "Chruch st",
                    createdAt : Date.now()
                },
                {
                    zipcode : "201008",
                    address : " Boston Commons",
                    createdAt : Date.now()
                }
            ]

            let response = [];
            for(let i=0; i<pickupStationData.length; i++) {
                // call createPickupStation(zipcode ,...)
                let addedPs = await pickupStaion.create(pickupStationData[i]);
                response.push(addedPs);
            }
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }
}
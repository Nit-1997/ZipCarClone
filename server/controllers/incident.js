const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const {cp850} = require("mysql2/lib/constants/encoding_charset");
const user = models.user;
const sequelize = models.sequelize;

module.exports = {
    create: async function (req, res) {
        try {
            // write code to create a user here.

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
    showIncidentPage : async (req,res) => {
        try{
            res.render('createIncident');
        }catch(error){
            console.log(error);
        }
    }

}
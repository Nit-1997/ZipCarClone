const Promise = require('bluebird');
const config = require('config');
const functions = require('../functions/index.js');
const models = require('../models/index.js');
const user = models.user;

module.exports = {
    create: async function (req, res) {
        try {
              // write code to create a user here.

        } catch (error) {
            console.log(error);
        }
    }

}
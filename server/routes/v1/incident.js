const express = require('express');
const server = express();


const router = express.Router();

//const functions = require('functions');
const controllers = require('../../controllers/index.js');
const incidentController = controllers.incident;

router.route('/createIncident')
    .post(incidentController.showIncidentPage);



server.use('/', router);

module.exports = server;
const express = require('express');
const server = express();


const router = express.Router();

const controllers = require('../../controllers/index.js');
const incidentController = controllers.incident;

router.route('/createIncident')
    .post(incidentController.showIncidentPage);

router.route('/addIncident')
    .post(incidentController.create);

router.route('/allIncidents')
    .post(incidentController.getAll);

router.route('/resolveIncident')
    .post(incidentController.resolveIncident);



server.use('/', router);

module.exports = server;
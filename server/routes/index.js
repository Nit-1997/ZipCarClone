let server = {prefix: '/v1', server: require('./v1/index.js') };
module.exports = server.server;
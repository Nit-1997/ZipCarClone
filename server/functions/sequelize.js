var Sequelize = require('sequelize');
var config = require('config');
const Op = Sequelize.Op;

var sequelize = new Sequelize(
    config.database.MYSQLDBName,
    config.database.MYSQLDBUsername,
    config.database.MYSQLDBPassword,
    {
        host: config.database.MYSQLDBHostname,
        dialect: 'mysql',
        dialectOptions: {
        },
        pool: {
        },
        define: {
            timestamps: false
        },
        timezone: '+00:00',
        operatorsAliases: {
            $and: Op.and,
            $or: Op.or,
            $eq: Op.eq,
            $gt: Op.gt,
            $lt: Op.lt,
            $lte: Op.lte,
            $like: Op.like
        }
    });

module.exports = sequelize;
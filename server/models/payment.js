'use strict';
module.exports = (sequelize, Sequelize) => {
    let paymentSchema = sequelize.define('payment', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        state: {
            type: Sequelize.ENUM("PROCESSING","SUCCESS","FAILED"),
            allowNull: false,
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    paymentSchema.associate =  (models) => {
     //no assocaitions
    };
    return paymentSchema;
};

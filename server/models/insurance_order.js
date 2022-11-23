'use strict';
module.exports = (sequelize, Sequelize) => {
    let insuranceOrderSchema = sequelize.define('insuranceOrder', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: Sequelize.ENUM("completed","ongoing","failed"),
            allowNull: false
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    insuranceOrderSchema.associate =  (models) => {
        insuranceOrderSchema.belongsTo(models.insurancePlan);
    };
    return insuranceOrderSchema;
};

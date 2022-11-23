'use strict';
module.exports = (sequelize, Sequelize) => {
    let insurancePlanSchema = sequelize.define('insurancePlan', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        minValidity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        premium: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        vehicleType: {
            type: Sequelize.ENUM("GO","XL","Premium"),
            allowNull: false
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    insurancePlanSchema.associate =  (models) => {
        insurancePlanSchema.belongsToMany(models.insuranceVendor,{through: 'mapper'});
    };
    return insurancePlanSchema;
};

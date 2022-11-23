'use strict';
module.exports = (sequelize, Sequelize) => {
    let insuranceVendorSchema = sequelize.define('insuranceVendor', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        scale: {
            type: Sequelize.ENUM("SMALL","MID","LARGE"),
            primaryKey: true,
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    insuranceVendorSchema.associate =  (models) => {
        //no associations
    };
    return insuranceVendorSchema;
};

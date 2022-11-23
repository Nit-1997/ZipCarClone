'use strict';
module.exports = (sequelize, Sequelize) => {
    let pickupStationSchema = sequelize.define('pickupStation', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        zipcode: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    pickupStationSchema.associate =  (models) => {
        // userSchema.hasMany(models.pub);
        // userSchema.hasMany(models.comment);
        // userSchema.hasMany(models.events);
        // userSchema.hasMany(models.transaction);
    };
    return pickupStationSchema;
};

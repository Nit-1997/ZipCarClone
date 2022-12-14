'use strict';
module.exports = (sequelize, Sequelize) => {
    var userSchema = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.ENUM("owner","client"),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    userSchema.associate =  (models) => {
         userSchema.hasMany(models.car);
         userSchema.hasMany(models.incidents);
         userSchema.hasMany(models.leaseOrder);
         userSchema.hasMany(models.payment);
    };
    return userSchema;
};

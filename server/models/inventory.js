'use strict';
module.exports = (sequelize, Sequelize) => {
    let inventorySchema = sequelize.define('inventory', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        zipcode: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("AVAILABLE","BOOKED","UNDER_MAINTENANCE"),
            allowNull: false
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    inventorySchema.associate =  (models) => {
        inventorySchema.belongsTo(models.pickupStation);
        inventorySchema.belongsTo(models.car);
    };
    return inventorySchema;
};

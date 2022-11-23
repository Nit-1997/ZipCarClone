'use strict';
module.exports = (sequelize, Sequelize) => {
    let carSchema = sequelize.define('car', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.ENUM("GO","XL","Premium"),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        make: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fuelType: {
            type: Sequelize.ENUM("Diesel","Petrol","Electric","Hybrid"),
            allowNull: false
        },
        rentalRate: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    carSchema.associate =  (models) => {
       carSchema.belongsTo(models.inventory);
    };
    return carSchema;
};

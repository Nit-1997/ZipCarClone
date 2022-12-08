'use strict';
module.exports = (sequelize, Sequelize) => {
    let leaseOrderSchema = sequelize.define('leaseOrder', {
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
    leaseOrderSchema.associate =  (models) => {
        leaseOrderSchema.hasOne(models.payment);
        leaseOrderSchema.hasMany(models.incidents);
        leaseOrderSchema.belongsTo(models.inventory);
    };
    return leaseOrderSchema;
};

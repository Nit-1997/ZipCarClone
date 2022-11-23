'use strict';
module.exports = (sequelize, Sequelize) => {
    let incidentsSchema = sequelize.define('incidents', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        severity: {
            type: Sequelize.ENUM("P1","P2","P3"),
            allowNull: false,
        },
        resolution: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        state: {
            type: Sequelize.ENUM("RESOLVED","RAISED","ASSIGNED","NOT_ASSIGNED"),
            allowNull: false,
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
    }, {});
    incidentsSchema.associate =  (models) => {
        // userSchema.hasMany(models.pub);
        // userSchema.hasMany(models.comment);
        // userSchema.hasMany(models.events);
        // userSchema.hasMany(models.transaction);
    };
    return incidentsSchema;
};

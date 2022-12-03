const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "insurancePlans", deps: []
 * createTable() => "insuranceVendors", deps: []
 * createTable() => "pickupStations", deps: []
 * createTable() => "users", deps: []
 * createTable() => "cars", deps: [users]
 * createTable() => "inventories", deps: [pickupStations, cars]
 * createTable() => "leaseOrders", deps: [inventories, users]
 * createTable() => "incidents", deps: [leaseOrders, users]
 * createTable() => "insuranceOrders", deps: [insurancePlans, leaseOrders]
 * createTable() => "payments", deps: [leaseOrders, users]
 * createTable() => "mapper", deps: [insurancePlans, insuranceVendors]
 *
 */

const info = {
  revision: 1,
  name: "mega_migration",
  created: "2022-11-29T23:07:32.008Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "insurancePlans",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        minValidity: {
          type: Sequelize.INTEGER,
          field: "minValidity",
          allowNull: false,
        },
        premium: {
          type: Sequelize.DECIMAL,
          field: "premium",
          allowNull: false,
        },
        vehicleType: {
          type: Sequelize.ENUM("GO", "XL", "Premium"),
          field: "vehicleType",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "insuranceVendors",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING, field: "name", primaryKey: true },
        scale: {
          type: Sequelize.ENUM("SMALL", "MID", "LARGE"),
          field: "scale",
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "pickupStations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        zipcode: {
          type: Sequelize.INTEGER,
          field: "zipcode",
          allowNull: false,
        },
        address: { type: Sequelize.STRING, field: "address", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: Sequelize.ENUM("owner", "client"),
          field: "type",
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        contact: { type: Sequelize.STRING, field: "contact", allowNull: true },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "cars",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: Sequelize.ENUM("GO", "XL", "Premium"),
          field: "type",
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        make: { type: Sequelize.INTEGER, field: "make", allowNull: false },
        fuelType: {
          type: Sequelize.ENUM("Diesel", "Petrol", "Electric", "Hybrid"),
          field: "fuelType",
          allowNull: false,
        },
        rentalRate: {
          type: Sequelize.DECIMAL,
          field: "rentalRate",
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "inventories",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        zipcode: {
          type: Sequelize.INTEGER,
          field: "zipcode",
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("AVAILABLE", "BOOKED", "UNDER_MAINTENANCE"),
          field: "status",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        pickupStationId: {
          type: Sequelize.INTEGER,
          field: "pickupStationId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "pickupStations", key: "id" },
          allowNull: true,
        },
        carId: {
          type: Sequelize.INTEGER,
          field: "carId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "cars", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "leaseOrders",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: Sequelize.ENUM("completed", "ongoing", "failed"),
          field: "status",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        inventoryId: {
          type: Sequelize.INTEGER,
          field: "inventoryId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "inventories", key: "id" },
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "incidents",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: Sequelize.STRING,
          field: "description",
          allowNull: false,
        },
        severity: {
          type: Sequelize.ENUM("P1", "P2", "P3"),
          field: "severity",
          allowNull: false,
        },
        resolution: {
          type: Sequelize.STRING,
          field: "resolution",
          allowNull: false,
        },
        state: {
          type: Sequelize.ENUM(
            "RESOLVED",
            "RAISED",
            "ASSIGNED",
            "NOT_ASSIGNED"
          ),
          field: "state",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        leaseOrderId: {
          type: Sequelize.INTEGER,
          field: "leaseOrderId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "leaseOrders", key: "id" },
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "insuranceOrders",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: Sequelize.ENUM("completed", "ongoing", "failed"),
          field: "status",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        insurancePlanId: {
          type: Sequelize.INTEGER,
          field: "insurancePlanId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "insurancePlans", key: "id" },
          allowNull: true,
        },
        leaseOrderId: {
          type: Sequelize.INTEGER,
          field: "leaseOrderId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "leaseOrders", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "payments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        state: {
          type: Sequelize.ENUM("PROCESSING", "SUCCESS", "FAILED"),
          field: "state",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: true,
        },
        leaseOrderId: {
          type: Sequelize.INTEGER,
          field: "leaseOrderId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "leaseOrders", key: "id" },
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "mapper",
      {
        insurancePlanId: {
          type: Sequelize.INTEGER,
          field: "insurancePlanId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "insurancePlans", key: "id" },
          primaryKey: true,
        },
        insuranceVendorId: {
          type: Sequelize.INTEGER,
          field: "insuranceVendorId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "insuranceVendors", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["cars", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["incidents", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["insuranceOrders", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["insurancePlans", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["insuranceVendors", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["inventories", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["leaseOrders", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["payments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["pickupStations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["mapper", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};

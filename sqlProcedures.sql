-- **********---
-- cars ---
-- **********---

-- findCarByID
DROP PROCEDURE IF EXISTS findCarById;

DELIMITER //

CREATE PROCEDURE findCarById(carId INT)
BEGIN
        select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as
        inventoryId, inventories.zipcode ,pickupStationId , address  from cars
        join inventories on cars.id = inventories.carId
        join pickupStations on pickupStations.id = inventories.pickupStationId
        where status = 'AVAILABLE' and cars.id = carId limit 1;
END //

DELIMITER ;


-- createCar
DROP PROCEDURE IF EXISTS createCar;
DELIMITER //
CREATE PROCEDURE createCar(userId INT, type VARCHAR(20), name VARCHAR(40), make INT, fuelType VARCHAR(20), rentalRate DECIMAL, zipcode INT)
BEGIN
		START TRANSACTION;
        IF (SELECT count(*) > 0 FROM pickupStations WHERE pickupStations.zipcode=zipcode) THEN
			SELECT id INTO @pickupId FROM pickupStations WHERE pickupStations.zipcode=zipcode; -- id of pickupstation for the given zip code
			INSERT INTO cars(type, name, make, fuelType, rentalRate, createdAt, userId)
			VALUES(type, name, make, fuelType, rentalRate, CURDATE(), userId);
            SELECT id INTO @carId FROM cars WHERE id = last_insert_id();
            INSERT INTO inventories(zipcode, status, createdAt, pickupStationId, carId)
			VALUES(zipcode, 'AVAILABLE', CURDATE(), @pickupId, @carId);
		ELSE
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'The given zipcode does not exist.';
		END IF;
        COMMIT;
END //
DELIMITER ;


-- updateCar
DROP PROCEDURE IF EXISTS updateCar;
DELIMITER //

CREATE PROCEDURE updateCar(carId INT, type NVARCHAR(20), name NVARCHAR(40), make INT, fuelType NVARCHAR(20), rentalRate FLOAT, zipcode NVARCHAR(10))
BEGIN
		START TRANSACTION;

		 IF (SELECT count(*) > 0 FROM pickupStations WHERE pickupStations.zipcode=zipcode) THEN
			SELECT id INTO @pickupStationId FROM pickupStations WHERE pickupStations.zipcode=zipcode;
			UPDATE cars
			SET cars.type=type, cars.name=name, cars.make=make, cars.fuelType=fuelType, cars.rentalRate=rentalRate
			WHERE cars.id=carId;
            UPDATE inventories
            SET inventories.pickupStationId = @pickupStationId , inventories.zipcode = zipcode
            WHERE inventories.carId = carId;
		ELSE
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'The given zipcode does not exist.';
		END IF;
		COMMIT;
END //

DELIMITER ;


-- showAvailaibleCars
DROP PROCEDURE IF EXISTS showAvailableCars;
DELIMITER //

CREATE PROCEDURE showAvailableCars()
BEGIN
		START TRANSACTION;
        select cars.id , type , name , make, fuelType, rentalRate , userId , inventories.id as inventoryId,
        inventories.zipcode ,pickupStationId , address  from cars join inventories on cars.id = inventories.carId
        join pickupStations on pickupStations.id = inventories.pickupStationId where status = 'AVAILABLE';
        COMMIT;
END //

DELIMITER ;


-- deleteCarByID
DROP PROCEDURE IF EXISTS deleteCarByID;
DELIMITER //

CREATE PROCEDURE deleteCarByID(carId INT)
BEGIN
		START TRANSACTION;
        DELETE FROM cars WHERE cars.id=carId;
		COMMIT;
END //

DELIMITER ;

-- tested


-- **********---
-- Orders ---
-- **********---

-- showAllUserOrderById
DROP PROCEDURE IF EXISTS showAllOrders;
DELIMITER //

CREATE PROCEDURE showAllOrders(userId INT)
BEGIN
		START TRANSACTION;
        SELECT leaseOrders.id as leaseOrderId, cars.name, cars.make, cars.fuelType , cars.rentalRate ,cars.type, payments.state AS paymentStatus,
        leaseOrders.status AS orderStatus  , leaseOrders.createdAt AS orderDate FROM leaseOrders
        JOIN payments ON leaseOrders.id = payments.leaseOrderId
        JOIN inventories ON leaseOrders.inventoryId = inventories.id
        JOIN cars ON cars.id = inventories.id
        WHERE leaseOrders.userId = userId;
		COMMIT;
END //

DELIMITER ;



-- createOrder
DROP PROCEDURE IF EXISTS createOrder;
DELIMITER //

CREATE PROCEDURE createOrder(date DATE,carId INT, userId INT)
BEGIN
        START TRANSACTION;
        select inventories.id INTO @inventoryId from cars join inventories on cars.id = inventories.carId
        join pickupStations on pickupStations.id = inventories.pickupStationId where status = 'AVAILABLE' and cars.id =carId;
        INSERT INTO leaseOrders(status, createdAt, inventoryId, userId)
        VALUES('ONGOING', date, @inventoryId, userId);
        select id INTO @leaseId from leaseOrders where id = (select last_insert_id());
        INSERT INTO payments(state, createdAt, leaseOrderId, userId)
        VALUES('SUCCESS', date, @leaseId , userId);
        IF (SELECT COUNT(*) > 0 FROM payments WHERE payments.leaseOrderId=@leaseId AND state='SUCCESS') THEN
            UPDATE leaseOrders SET status='COMPLETED' where leaseOrders.id=@leaseId;
            UPDATE inventories SET status='BOOKED' where inventories.id=@inventoryId;
        END IF;
        COMMIT;
END //

DELIMITER ;



-- **********---
-- user ---
-- **********---

-- signup
DROP PROCEDURE IF EXISTS signup;
DELIMITER //
CREATE PROCEDURE signup(IN email NVARCHAR(100),IN type NVARCHAR(10),IN password NVARCHAR(100),IN name NVARCHAR(100),IN contact Char(10))
BEGIN
        START TRANSACTION;
        if (validEmail(email) !=1) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Email';
		END IF;
        if (checkLength(contact, 10)!=1) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contact Number should be 10 digits.';
		END IF;
        IF  (SELECT count(*) > 0 FROM users WHERE users.email=email) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A user with the given email already exists.';
		ELSE
			INSERT INTO users(id, type, name, email, password, contact, createdAt)
			VALUES(id, type, name, email, password, contact, CURDATE()) ;
            SELECT * FROM users WHERE users.email=email;
        END IF;
		COMMIT;
END //

DELIMITER ;



-- login
DROP PROCEDURE IF EXISTS login;
DELIMITER //

CREATE PROCEDURE login(email VARCHAR(255), password VARCHAR(255))
BEGIN
		START TRANSACTION;
        if (validEmail(email) !=1) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Email';
		END IF;

		IF (SELECT COUNT(*) = 0 FROM users WHERE users.email=email AND users.password=password) THEN
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'INVALID username or password';
		END IF;
        SELECT * FROM users WHERE users.email=email AND users.password=password;
        COMMIT;
END //

DELIMITER ;




-- **********---
-- incidents ---
-- **********---

-- createIncident
DROP PROCEDURE IF EXISTS createIncident;

DELIMITER //
CREATE PROCEDURE createIncident(title VARCHAR(100), description VARCHAR(500), severity VARCHAR(50), leaseOrderId INT, userId INT)
BEGIN
		START TRANSACTION;
        INSERT INTO incidents(title , description, severity, resolution, state, createdAt, leaseOrderId, userId)
		VALUES(title , description, severity, '', 'RAISED', CURDATE(), leaseOrderId, userId);
        select * from incidents where id = (select last_insert_id());
		COMMIT;
END //

DELIMITER ;





-- getAllIncidents
DROP PROCEDURE IF EXISTS getAllIncidents;
DELIMITER //

CREATE PROCEDURE getAllIncidents(userId INT, leaseId INT)
BEGIN
		START TRANSACTION;
        SELECT * FROM incidents WHERE userId=userId AND leaseOrderId=leaseId;
		COMMIT;
END //

DELIMITER ;




-- resolveIncident
DROP PROCEDURE IF EXISTS resolveIncident;
DELIMITER //

CREATE PROCEDURE resolveIncident(resolution VARCHAR(100), id INT)
BEGIN
		START TRANSACTION;
        UPDATE incidents SET resolution=resolution, state='RESOLVED' WHERE incidents.id = id;
		COMMIT;
END //

DELIMITER ;


-- **********---
-- functions ---
-- **********---

-- checkDigits
DROP function if exists checkDigits;
DELIMITER //
CREATE FUNCTION checkDigits(number INT)
RETURNS INT
DETERMINISTIC READS SQL DATA
BEGIN
	RETURN LENGTH(number);
END//
DELIMITER ;


-- checkLength
DROP function if exists checkLength;
DELIMITER //
CREATE FUNCTION checkLength(word VARCHAR(1000), length INT)
RETURNS BOOL
DETERMINISTIC READS SQL DATA
BEGIN
	RETURN IF(LENGTH(word)=length, True, False);
END//
DELIMITER ;


-- validEmail
DROP FUNCTION IF EXISTS validEmail;
DELIMITER //
CREATE FUNCTION validEmail(email VARCHAR(255))
RETURNS BOOL
DETERMINISTIC READS SQL DATA
BEGIN
	RETURN IF(email REGEXP '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$', TRUE, FALSE);
END//
DELIMITER ;


-- Procedure to insert a pickup station
DROP PROCEDURE IF EXISTS createPickupStation;
DELIMITER //

CREATE PROCEDURE createPickupStation(zipcode INT, address NVARCHAR(100))
BEGIN
        INSERT INTO pickupStations(zipcode, address, createdAt)
        VALUES(zipcode, address, CURDATE());
END //

DELIMITER ;

-- bulk insert serviceable pickup stations
CALL createPickupStation(201005,'Boylston St');
CALL createPickupStation(201006,'Beacon St');
CALL createPickupStation(201007,'Church St');
CALL createPickupStation(201008,'Boston Commons');



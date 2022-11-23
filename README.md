# ZipCarClone
Database project to clone zipCar


# HOW TO START APPLICATION
 - Run  ```dbStart.sql``` in workbench. This will create the zipcar user , zipcar db and grant priveledges to the user.
 - Run ```npm install``` to install all node_modules to your developement environment.
 - Run ```npm start``` to start the zipcar server.
 - You should be able to access the backend apis at http://localhost:7000/

# How to make Database migrations
 - Install ```sequelize-mig``` to create migrations from your database models.
 - Run ```sequelize-mig migration:make -n mega_migration``` , you should see the mega-migration created inside your migrations folder.
 - Run the migration using  ```npx sequelize-cli  db:migrate``` to create the physical tables in the database.

# Database Model 
![](erd.png)
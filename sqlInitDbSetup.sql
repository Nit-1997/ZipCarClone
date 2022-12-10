-- RUN THIS IN YOUR WORKBENCH BEFORE STARTING THE PROJECT
create database zipcar;
CREATE USER 'zipuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'zipcar';
GRANT ALL PRIVILEGES ON zipcar.* TO 'zipuser'@'localhost';
USE zipcar;
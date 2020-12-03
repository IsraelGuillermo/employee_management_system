DROP DATABASE IF EXISTS employee_managementDB
CREATE DATABASE employee_managementDB

USE employee_managementDB

CREATE TABLE emploee (
first_name VARCHAR(30) 
,last_name VARCHAR(30) 
,role_id INT 
,manager_id INT
)

CREATE TABLE department(
id INT PRIMARY KEY
name VARCHAR(30)
)

CREATE TABLE role(
id INT PRIMARY KEY
title VARCHAR(30) 
salary DECIMAL to hold role salary
department_id INT
)


DROP DATABASE IF EXISTS employee_managementDB;
CREATE DATABASE employee_managementDB;

USE employee_managementDB;


CREATE TABLE department(
id INT PRIMARY KEY AUTO_INCREMENT
,name VARCHAR(30)
);
CREATE TABLE role(
id INT PRIMARY KEY AUTO_INCREMENT
,title VARCHAR(30) 
,salary DECIMAL
,department_id INT,
INDEX `index_department`(department_id),
CONSTRAINT `FK_char_department`
FOREIGN KEY (department_id)
REFERENCES department(id) ON DELETE CASCADE 
);

CREATE TABLE employee (
id INT PRIMARY KEY AUTO_INCREMENT
,first_name VARCHAR(30) 
,last_name VARCHAR(30) 
,role_id INT, 
INDEX `index_role`(role_id),
CONSTRAINT `FK_char_role`
FOREIGN KEY (role_id)
REFERENCES role(id) ON DELETE CASCADE 
,manager_id INT,
FOREIGN KEY (manager_id)
REFERENCES employee (id)
);
const inquirer = require("inquirer");
const mysql = require("mysql");
const { addEmployee, addDepartment, addRole } = require("./lib/add");
const { viewEmployees, viewByDepartments, viewByRoles } = require("./lib/view");
const { updateEmployeeRoles } = require("./lib/update");
const firstQuestion = {
  name: "firstQuestion",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "Add Employee",
    "Add Department",
    "Add Role",
    "View Employees",
    "View By Departments",
    "View By Roles",
    "Update Employee Role",
    "Quit",
  ],
};

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_managementDB",
});

connection.connect(function (err) {
  if (err) throw err;
  init();
});

function init() {
  inquirer.prompt(firstQuestion).then((response) => {
    switch (response.firstQuestion) {
      case "Add Employee":
        addEmployee(connection, init);
        break;
      case "Add Department":
        addDepartment(connection, init);
        break;
      case "Add Role":
        addRole(connection, init);
        break;
      case "View Employees":
        viewEmployees(connection, init);
        break;
      case "View By Departments":
        viewByDepartments(connection, init);
        break;
      case "View By Roles":
        viewByRoles(connection, init);
        break;
      case "Update Employee Role":
        updateEmployeeRoles(connection, init);
        break;
      case "Quit":
        quit();
        break;
    }
  });
}

function quit() {
  connection.end();
}

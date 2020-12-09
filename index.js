const inquirer = require("inquirer");
const mysql = require("mysql");

// These variables  pull functions from the lib folder
const { addEmployee, addDepartment, addRole } = require("./lib/add");
const {
  viewDepartments,
  viewEmployees,
  viewByDepartments,
  viewByRoles,
  viewRoles,
} = require("./lib/view");
const { updateEmployeeRoles } = require("./lib/update");

// This is the first question which will be asked when the program is ran
const firstQuestion = {
  name: "firstQuestion",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "Add Employee",
    "Add Department",
    "Add Role",
    "View Employees",
    "View Roles",
    "View Departments",
    "View By Departments",
    "View By Roles",
    "Update Employee Role",
    "Quit",
  ],
};

// Creating conenection to mySQL

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_managementDB",
});

// Once connected program is initiated by calling the init() function.
connection.connect(function (err) {
  if (err) throw err;
  init();
});

//  Function intiates program and ask what the user would like to do, based on response the program will run different functions.

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
      case "View Roles":
        viewRoles(connection, init);
        break;
      case "View Departments":
        viewDepartments(connection, init);
        break;
      case "Quit":
        quit();
        break;
    }
  });
}

// This function ends the program if user selects to quit
function quit() {
  connection.end();
}

const mysql = require("mysql");
const inquirer = require("inquirer");
const firstQuestion = {
  name: "firstQuestion",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "Add Employee",
    "Add Department",
    "Add Role",
    "View Employess",
    "View Departments",
    "View Roles",
    "Update Employee Role",
  ],
};
const newEmployee = [
  {
    name: "firstName",
    type: "input",
    message: "What is the employee's first name?",
  },
  {
    name: "lastName",
    type: "input",
    message: "What is the employee's last name?",
  },
  //   {
  //     name: "role",
  //     type: "list",
  //     message: "What is the employee's role",
  //   },
  //   {
  //     name: "manager",
  //     type: "list",
  //     message: "Who is the employee's manager",
  //   },
];

function initialQuestion() {
  inquirer.prompt(firstQuestion).then((response) => {
    switch (response.firstQuestion) {
      case "Add Employee":
        addEmployee();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "View Employess":
        viewEmployees();
        break;
      case "View Departments":
        viewDepartments();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "Update Employee Role":
        viewUpdateEmployeeRoles();
        break;
    }
  });
}

function addEmployee() {
  inquirer.prompt(newEmployee).then((response) => {
    console.log(rresponse);
  });
}
function addDepartment() {}
function addRole() {}
function viewEmployees() {}
function viewEmployees() {}
function viewDepartments() {}
function viewRoles() {}
function viewUpdateEmployeeRoles() {}

initialQuestion();

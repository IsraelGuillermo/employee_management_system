const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_managementDB",
});

connection.connect(function (err) {
  if (err) throw err;
  initialQuestion();
});
const firstQuestion = {
  name: "firstQuestion",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "Add Employee",
    "Add Department",
    "Add Role",
    "View Employess",
    "View By Departments",
    "View By Roles",
    "Update Employee Role",
  ],
};

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
      case "View By Departments":
        viewByDepartments();
        break;
      case "View By Roles":
        viewByRoles();
        break;
      case "Update Employee Role":
        viewUpdateEmployeeRoles();
        break;
    }
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;

    inquirer
      .prompt([
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
        {
          name: "role",
          type: "list",
          message: "What is the employee's role",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
        },
        //   {
        //     name: "manager",
        //     type: "list",
        //     message: "Who is the employee's manager",
        //   },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: response.firstName,
            last_name: response.lastName,
          },

          function (err) {
            if (err) throw err;
            console.log("The Employee has been added to the Database");
            initialQuestion();
          }
        );
      });
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "addDepartment",
        type: "input",
        message: "What is the name of the department?",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: response.addDepartment,
        },
        function (err) {
          if (err) throw err;
          console.log("The department has been added to the Database");
          initialQuestion();
        }
      );
    });
}
function addRole() {
  inquirer
    .prompt([
      {
        name: "addRole",
        type: "input",
        message: "What is the name of the role?",
      },
      {
        name: "addSalary",
        type: "input",
        message: "What is the salary of the role?",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: response.addRole,
          salary: response.addSalary,
        },
        function (err) {
          if (err) throw err;
          console.log("The role has been added to the Database");
          initialQuestion();
        }
      );
    });
}
function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    console.table(results);
  });
}
function viewByDepartments() {
  connection.query("SELECT name FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "viewByDept",
          type: "list",
          message: "Which department would you like to view?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
        },
      ])
      .then((response) => {
        console.log(response);
      });
  });
}
function viewByRoles() {
  connection.query("SELECT title FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "viewByRole",
          type: "list",
          message: "Which role would you like to view?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
        },
      ])
      .then((response) => {
        console.log(response);
      });
  });
}
function UpdateEmployeeRoles() {}

// Need to figure out how to link all of this information to one main table. Also need to know how to delete information from server.

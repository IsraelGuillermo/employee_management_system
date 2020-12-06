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
  init();
});
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

function init() {
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
      case "View Employees":
        viewEmployees();
        break;
      case "View By Departments":
        viewByDepartments();
        break;
      case "View By Roles":
        viewByRoles();
        break;
      case "Update Employee Role":
        updateEmployeeRoles();
        break;
      case "Quit":
        quit();
        break;
    }
  });
}

function addEmployee() {
  var managerArray = ["None"];
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      let obj = {
        name: results[i].first_name,
        value: results[i].id,
      };

      managerArray.push(obj);
    }
  });
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
              let obj = {
                name: results[i].title,
                value: results[i].id,
              };

              choiceArray.push(obj);
            }
            return choiceArray;
          },
        },

        {
          name: "manager",
          type: "list",
          message: "Who is the employee's manager",
          choices: function () {
            return managerArray;
          },
        },
      ])
      .then((response) => {
        if (response.manager === "None") {
          connection.query(
            "INSERT INTO employee SET ?",

            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: response.role,
            },

            function (err) {
              if (err) throw err;
              console.log("The Employee has been added to the Database");
              init();
            }
          );
        } else {
          connection.query(
            "INSERT INTO employee SET ?",

            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: response.role,
              manager_id: response.manager,
            },

            function (err) {
              if (err) throw err;
              console.log("The Employee has been added to the Database");
              init();
            }
          );
        }
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
          init();
        }
      );
    });
}
function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
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
        {
          name: "department",
          type: "list",
          message: "What department is this role a part of?",
          choices: function () {
            var deptArray = [];
            for (var i = 0; i < results.length; i++) {
              let obj = {
                name: results[i].name,
                value: results[i].id,
              };
              deptArray.push(obj);
            }
            return deptArray;
          },
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
            init();
          }
        );
      });
  });
}
function viewEmployees() {
  connection.query(
    `SELECT 
        concat(emp.first_name, ' ',emp.last_name) AS Employee
        ,rl.title AS Title
        ,rl.salary AS Salary
        ,dept.name AS Department
        ,concat(mgr.first_name,' ',mgr.last_name) as Manager
    FROM employee AS emp 
        JOIN role AS rl 
            ON emp.role_id=rl.id 
        JOIN department AS dept 
            ON rl.department_id=dept.id
        LEFT JOIN employee AS mgr 
            ON emp.manager_id=mgr.id `,
    function (err, results) {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
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
        var optionSelected = response.viewByDept;
        var sql =
          `SELECT
          concat(emp.first_name, ' ',emp.last_name) AS Employee
          ,rl.title AS Title
          ,dept.name AS Department 
          ,concat(mgr.first_name,' ',mgr.last_name) as Manager
          FROM employee AS emp 
          LEFT JOIN employee AS mgr 
            ON emp.manager_id=mgr.id
          JOIN role AS rl 
            ON emp.role_id=rl.id 
        JOIN department AS dept 
            ON rl.department_id=dept.id  
        WHERE dept.name =` + connection.escape(optionSelected);
        connection.query(sql, function (err, results) {
          if (err) throw err;
          console.table(results);
          init();
        });
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
        var optionSelected = response.viewByRole;
        var sql =
          `SELECT
          concat(emp.first_name, ' ',emp.last_name) AS Employee
          ,rl.title AS Title
          ,dept.name AS Department 
          ,concat(mgr.first_name,' ',mgr.last_name) as Manager
          FROM employee AS emp 
          LEFT JOIN employee AS mgr 
            ON emp.manager_id=mgr.id
          JOIN role AS rl 
            ON emp.role_id=rl.id 
            JOIN department AS dept 
            ON rl.department_id=dept.id  
        WHERE rl.title =` + connection.escape(optionSelected);
        connection.query(sql, function (err, results) {
          if (err) throw err;
          console.table(results);
          init();
        });
      });
  });
}

function quit() {
  connection.end();
}
function updateEmployeeRoles() {
  var employeeArray = [];
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      let obj = {
        name: results[i].first_name,
        value: results[i].id,
      };

      employeeArray.push(obj);
    }
  });
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: function () {
            return employeeArray;
          },
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's new role",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let obj = {
                name: results[i].title,
                value: results[i].id,
              };

              choiceArray.push(obj);
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
// Need to figure out how to link all of this information to one main table. Also need to know how to delete information from server.

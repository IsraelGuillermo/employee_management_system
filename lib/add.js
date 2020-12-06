const inquirer = require("inquirer");

module.exports = {
  addEmployee: function (connection, init) {
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
  },
  addDepartment: function (connection, init) {
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
  },
  addRole: function (connection, init) {
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
  },
};

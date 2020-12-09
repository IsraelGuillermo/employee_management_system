const inquirer = require("inquirer");

module.exports = {
  // This functions allows user to add employee and pushes data to database
  addEmployee: function (connection, init) {
    // options array starts with none lines for manager but then each employee is added as a potential candidate for manager.
    var managerArray = ["None"];
    // this loops through employees to generate the choices for managers
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
            // this loops through roles list to generate choices
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
        // based on user response the program either inserts name and role or name, role and manager if one is selected
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
  // This function allows user to add department to database
  addDepartment: function (connection, init) {
    // This question asks what the name of the department is
    inquirer
      .prompt([
        {
          name: "addDepartment",
          type: "input",
          message: "What is the name of the department?",
        },
      ])
      // response is inserted into db
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
  // function which allows user to add a specific rols

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
          // This question asks which department the role belongs in. It first loops through the departments listed in the database.
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
        // Then the data is inserted into the db
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

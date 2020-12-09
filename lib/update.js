const inquirer = require("inquirer");

module.exports = {
  // this function allows user to update role for employee
  updateEmployeeRoles: function (connection, init) {
    // starts with empty employee array, then program select all employees from employee table. This is used to generate the choices when user is prompted to choose an employee
    var employeeArray = [];
    connection.query("SELECT * FROM employee", function (err, results) {
      if (err) throw err;
      for (var i = 0; i < results.length; i++) {
        let obj = {
          name: results[i].first_name + " " + results[i].last_name,
          value: results[i].id,
        };

        employeeArray.push(obj);
      }
    });
    // program then queries through role table to generate choices for user to select the new role for the employee. A role can only be selected if its already listed in the role table
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
              // this array starts empty but it is filled by the for loop when looking at data in the employee list
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
          // role for the specific employee is then updated
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [response.role, response.employee],
            function (err) {
              if (err) throw err;
              console.log("The role for this employee has been updated");
              init();
            }
          );
        });
    });
  },
};

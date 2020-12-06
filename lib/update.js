const inquirer = require("inquirer");

module.exports = {
  updateEmployeeRoles: function (connection, init) {
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

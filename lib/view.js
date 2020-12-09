const inquirer = require("inquirer");

module.exports = {
  // this functions pulls employee information and lists role, salary, department name of employee and name of manager. It joins all 3 db tables.
  viewEmployees: function (connection, init) {
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
  },
  viewRoles: function (connection, init) {
    connection.query(`SELECT title AS Role FROM role`, function (err, results) {
      if (err) throw err;
      console.table(results);
      init();
    });
  },
  // view departments which selects departments from dept table
  viewDepartments: function (connection, init) {
    connection.query(
      `SELECT name AS Department FROM department`,
      function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
      }
    );
  },
  // additionally added functionality which allows user to see employees by department
  viewByDepartments: function (connection, init) {
    // user is asked which dept to look
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
          // program responds with data including name, role, department and manager name
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
  },
  // similar to view by dept, this function allows user to view by roles
  viewByRoles: function (connection, init) {
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
  },
};

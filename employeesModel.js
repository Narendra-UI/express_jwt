const sql = require("./db.js");

// constructor
const Employees = function(employees) {
  this.firstname = employees.firstname;
  this.lastname = employees.lastname;
};

Employees.createNewEmployee = (newEmployees, result) => {
    console.log(newEmployees);
    sql.query("INSERT INTO employees SET ?", newEmployees, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created employees: ", { id: res.insertId, ...newEmployees });
      result(null, { id: res.insertId, ...newEmployees });
    });
};

Employees.findById = (id, result) => {
    sql.query(`SELECT * FROM employees WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found employees: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
    });
};


Employees.getAllEmployees = (firstname, result) => {
    let query = "SELECT * FROM employees";
  
    if (firstname) {
      query += ` WHERE firstname LIKE '%${firstname}%'`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("employees: ", res);
      result(null, res);
    });
};


Employees.updateById = (id, employees, result) => {
    sql.query(
      "UPDATE employees SET firstname = ?, lastname = ? WHERE id = ?",
      [employees.firstname, employees.lastname, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Tutorial with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated employees: ", { id: id, ...employees });
        result(null, { id: id, ...employees });
      }
    );
};


Employees.remove = (id, result) => {
    sql.query("DELETE FROM employees WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Employe with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted employees with id: ", id);
      result(null, res);
    });
  };
  
  Employees.removeAll = result => {
    sql.query("DELETE FROM employees", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} employees`);
      result(null, res);
    });
  };
  
  module.exports = Employees;
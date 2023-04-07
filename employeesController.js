// const data = {
//     Employees: require('../model/employees.json'),
//     setEmployees: function (data) { this.employees = data }
// }

// const Employees = function(employees) {
//     this.firstname = employees.firstname;
//     this.lastname = employees.lastname;
//   };

// const getAllEmployees = (req, res) => {
//     res.json(data.employees);
// }


// const createNewEmployee = (req, res) => {
//     const newEmployee = {
//         id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname
//     }

//     if (!newEmployee.firstname || !newEmployee.lastname) {
//         return res.status(400).json({ 'message': 'First and last names are required.' });
//     }

//     data.setEmployees([...data.employees, newEmployee]);
//     res.status(201).json(data.employees);
// }


// const updateEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     //[{id:2}]
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     if (req.body.firstname) employee.firstname = req.body.firstname;
//     if (req.body.lastname) employee.lastname = req.body.lastname;

//     ///req.body.id = 2


//     //[{id:1},{id:2},{id:3,}]
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     //[{id:1,},{id:3}]

//     const unsortedArray = [...filteredArray, employee];
//     data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.employees);
// }


// const deleteEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     data.setEmployees([...filteredArray]);
//     res.json(data.employees);
// }


// const getEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
//     }
//     res.json(employee);
// }


const Employees = require("../model/employeesModel.js");




// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  console.log("_______________________________");
  console.log(req); // { body:"values"}
  //console.log(res);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a employe
  const employee = new Employees ({  /// this will call constructor in employee model class
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
    
  Employees.createNewEmployee(employee, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Employee."
        });
        else res.send(data);
        });
};

    // Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;

    Employees.getAllEmployees(title, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving employees."
        });
        else res.send(data);
        });
};



exports.findOne = (req, res) => { 
        Employees.findById(req.params.id, (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Employe with id ${req.body.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Employe with id " + req.body.id
              });
            }
          } else res.send(data);
        });
};


exports.update = (req, res) => {
        // Validate Request
        if (!req.body) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
        }
      
        console.log(req.body);
      
        Employees.updateById(
          req.body.id,
          new Employees(req.body),
          (err, data) => {
            if (err) {
              if (err.kind === "not_found") {
                res.status(404).send({
                  message: `Not found Employees with id ${req.body.id}.`
                });
              } else {
                res.status(500).send({
                  message: "Error updating Employees with id " + req.body.id
                });
              }
            } else res.send(data);
          }
        );
};


exports.delete = (req, res) => {
        Employees.remove(req.body.id, (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Employees with id ${req.body.id}.`
              });
            } else {
              res.status(500).send({
                message: "Could not delete Employees with id " + req.body.id
              });
            }
          } else res.send({ message: `Employees was deleted successfully with respective to ID!` });
        });
};


exports.deleteAll = (req, res) => {
        Employees.removeAll((err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while removing all employees."
            });
          else res.send({ message: `All Employees were deleted successfully!` });
        });
};
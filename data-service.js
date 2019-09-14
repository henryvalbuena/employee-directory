const Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_DB || 'postgres', 
    process.env.DATABASE_USER || 'postgres', 
    process.env.DATABASE_PW || '1234', {
    host: process.env.DATABASE_HOST || 'db',
    dialect: 'postgres',
    dialectOptions: {
        ssl: false
    }
});


var Employee = sequelize.define('Employee', {
    adminName: Sequelize.STRING,
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {resolve('Success')})
            .catch(err => {reject(err)});
    });
}

function getAllEmployees(adminName) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {adminName: adminName}
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getEmployeesByStatus(adminName, status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({where: {adminName: adminName, status: status}}).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getEmployeesByDepartment(adminName, department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({where: {adminName: adminName, departmentId: department}}).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getEmployeesByManager(adminName, manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({where: {adminName: adminName, employeeManagerNum: manager}}).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getEmployeeByNum(adminName, num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({where: {adminName: adminName, employeeNum: num}}).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getManagers(adminName) {
    return new Promise((resolve, reject) => {
        Employee.findAll({where: {adminName: adminName, isManager: true}}).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function getDepartments() {
    return new Promise((resolve, reject) => {
        Department.findAll().then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

function addEmployee(adminName, employeeData) {
    let data = parseEmployee(adminName, employeeData);
    return new Promise((resolve, reject) => {
        Employee.create(
            data
        ).then(() => {resolve('Success')})
          .catch(err => { reject(err)});
    });
}

function updateEmployee(adminName, employeeData) {
    let data = parseEmployee(adminName, employeeData, employeeData.employeeNum);
    return new Promise((resolve, reject) => {
        Employee.update(
            data,
            {
                where: {
                    adminName: adminName,
                    employeeNum: employeeData.employeeNum
                }
            }
        ).then(() => {resolve('Success')})
         .catch(err => { reject(err)});
    });
}

function deleteEmployee(adminName, employeeNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy(
            {
                where : 
                {
                    adminName: adminName,
                    employeeNum: employeeNum
                }
            }
        ).then(() => {
            resolve('Success')
        }).catch(err => { 
            reject(err)
        });
    });
}

function addDepartment(departmentData) {
    return new Promise((resolve, reject) => {
        Department.create({
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve('Success')
        }).catch(err => { 
            reject(err)
        });
    });
}

function updateDepartment(departmentData) {
    return new Promise((resolve, reject) => {
        Department.update(
            {
                departmentName: departmentData.departmentName
            },
            {
                where: {
                    departmentId: departmentData.departmentId
                }
            }
        ).then(() => {
            resolve('Success');
        }).catch(err => { 
            reject(err);
        });
    });
}

function getDepartmentById(id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { departmentId: id }
        }).then(dept => { resolve(dept) })
          .catch(err => { reject(err) });
    });
}

function deleteDepartment(id) {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {
                departmentId: id
            }
        }).then(() => {
            resolve('Success');
        }).catch(err => {
            reject(err);
        });
    });
}

// helper functions

function parseEmployee(adminName, data, pos) {
    let temp_emp = undefined;

    // if (pos) {
    //     Employee.findAll({where: {
    //         employeeNum: pos
    //     }}).then(emp => {
    //         temp_emp = emp;
    //     }).catch(() => {
    //         temp_emp = undefined;
    //     });
    // }
    return employee = {
        adminName: adminName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        SSN: data.SSN,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressPostal: data.addressPostal,
        maritalStatus: data.maritalStatus,
        isManager: data.isManager ? false : true,
        employeeManagerNum: data.employeeManagerNum ? parseInt(data.employeeManagerNum) : null,
        status: data.status,
        department: parseInt(data.department),
        hireDate: temp_emp ? temp_emp.hireDate : data.hireDate
    };
}

function parseData(data) {
    if(!data.firstName) return false;
    if(!data.lastName) return false;
    if(!data.email) return false;
    if(!data.SSN) return false;
    if(!data.addressStreet) return false;
    if(!data.addressCity) return false;
    if(!data.addressState) return false;
    if(!data.addressPostal) return false;
    if(!data.department) return false;
    if(!data.hireDate) return false;
    return true;
}

module.exports = {
    initialize,
    getAllEmployees,
    getManagers,
    getDepartments,
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee,
    deleteEmployee,
    addDepartment,
    updateDepartment,
    getDepartmentById,
    deleteDepartment
}
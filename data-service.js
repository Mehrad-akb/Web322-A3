const fs = require('fs')
const { resolve } = require('path')


let employees
let departments

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) reject("Failure to read file employees.json!");
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json', (err, data) => {
                if (err) reject("Failure to read file departments.json!");
                departments = JSON.parse(data);
                resolve()
            })
        })
    })
}

exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) reject(Error("no results (employees) returned"))
        resolve(employees)
    })
}

exports.getManagers = () => {
    return new Promise((resolve, reject) => {
        const managers = []
        for (let index = 0; index < employees.length; index++) {
            const element = employees[index];
            if (element.isManager) managers.push(element)
        }
        resolve(managers)
        if (managers.length == 0) reject(Error("no results (managers) returned"))
    })
}

exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        if (departments.length == 0) reject(Error("no results (departments) returned"))
        resolve(departments)
    })
}

exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        let isManager
        if (employeeData.isManager == undefined) {
            isManager = false
        } else {
            isManager = true
        }
        const employeeNumber = employees.length + 1
        const employeeObject = {
            "employeeNum": employeeNumber,
            "firstName": employeeData.firstName,
            "lastName": employeeData.lastName,
            "email": employeeData.email,
            "SSN": employeeData.SSN,
            "addressStreet": employeeData.addressStreet,
            "addressCity": employeeData.addressCity,
            "addressState": employeeData.addressState,
            "addressPostal": employeeData.addressPostal,
            "maritalStatus": "single",
            "isManager": isManager,
            "employeeManagerNum": employeeData.employeeManagerNum,
            "status": employeeData.status,
            "department": employeeData.department,
            "hireDate": employeeData.hireDate
        }
        employees.push(employeeObject)
        resolve()
    })
}

exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        const filteredEmployees = []
        for (let index = 0; index < employees.length; index++) {
            const element = employees[index];
            if (element.status == status) filteredEmployees.push(element)
        }
        resolve(filteredEmployees)
        if (filteredEmployees.length == 0) reject(Error("no employees found with this condition(status)"))
    })
}
exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        const departmentEmployees = []
        for (let index = 0; index < employees.length; index++) {
            const element = employees[index];
            if (element.department == department) departmentEmployees.push(element)
        }
        resolve(departmentEmployees)
        if (departmentEmployees.length == 0) reject(Error("no employees found with this condition(department)"))
    })
}

exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        const employeesManager = []
        for (let index = 0; index < employees.length; index++) {
            const element = employees[index];
            if (element.employeeManagerNum == manager) employeesManager.push(element)
        }
        resolve(employeesManager)
        if (employeesManager.length == 0) reject(Error("no employees found with this condition(manager)"))
    })
}

exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        const employee = employees.filter((e) => {
            return e.employeeNum == num
        })
        if (!employee) reject(Error("no employees found with this condition(EmployeeNumber)"))
        resolve(employee)
    })
}
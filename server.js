/*************************************************************************
 * WEB322- Assignment 3
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Mehrad Akbari  Student ID: 130077217 Date: 11/10/2022
 * 
 * Your app’s URL (from Heroku) that I can click to see your application:
 * https://ancient-fjord-92733.herokuapp.com/
 * 
 * ************************************************************************/
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dataService = require('./data-service')

require('dotenv').config()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/uploaded')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const app = express()

const port = process.env.PORT

const upload = multer({ storage: storage })

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// routes

app.get('/', (req, res) => {
    res.sendFile('./views/home.html', { root: __dirname })
})

app.get('/about', (req, res) => {
    res.sendFile('./views/about.html', { root: __dirname })
})

app.get('/employees', (req, res) => {
    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then((data) => res.json(data))
            .catch(err => console.log(err))
    }
    if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then((data) => res.json(data))
            .catch(err => console.log(err))
    }
    if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then((data) => res.json(data))
            .catch(err => console.log(err))
    }
    dataService.getAllEmployees()
        .then(data => res.json(data))
        .catch(err => console.log(err))

})
app.get('/employee/:number', (req, res) => {
    dataService.getEmployeeByNum(req.params.number)
        .then(data => res.json(data))
        .catch(err => console.log(err))
})
app.get('/managers', (req, res) => {
    dataService.getManagers()
        .then(data => res.json(data))
        .catch(err => console.log(err))
})
app.get('/departments', (req, res) => {
    dataService.getDepartments()
        .then(data => res.json(data))
        .catch(err => console.log(err))
})
app.get('/employees/add', (req, res) => {
    res.sendFile('./views/addEmployee.html', { root: __dirname })
})

app.get('/images/add', (req, res) => {
    res.sendFile('./views/addImage.html', { root: __dirname })
})
app.post('/images/add', upload.single("imageFile"), (req, res) => {
    res.redirect('/images')
})
app.get('/images', (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        if (err) return console.log(err)
        res.json(items)
    })
})


app.post('/employees/add', (req, res) => {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(err => console.log(err))
})
// 404 not found
app.get('*', function (req, res) {
    res.sendFile('./views/404.html', { root: __dirname })
})


// starting the server
dataService.initialize()
    .then(
        app.listen(port, () => {
            console.log(`Express http server listening on ${port}`)
        })
    )
    .catch(err => console.log(err))
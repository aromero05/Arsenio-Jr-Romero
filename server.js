/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ARSENIO JR ROMERO    Student ID: 149873218   Date:July 12, 2023
*
* Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/



const collegeDataModule = require('./modules/collegeData');
var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var path = require('path');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

function handleStudents(req, res) {
  const course = req.query['course'];
  if (course) {
    collegeDataModule
      .getStudentsByCourse(course)
      .then(function (response) {
        res.json(response);
      })
      .catch(function () {
        res.json({ message: 'no results' });
      });
  } else {
    collegeDataModule
      .getAllStudents()
      .then(function (response) {
        res.json(response);
      })
      .catch(function () {
        res.json({ message: 'no results' });
      });
  }
}

function handleStudent(req, res) {
  const num = req.params['num'];
  if (num) {
    collegeDataModule
      .getStudentByNum(num)
      .then(function (response) {
        res.json(response);
      })
      .catch(function () {
        res.json({ message: 'no results' });
      });
  } else {
    res.json({ message: 'no results' });
  }
}

function handleTAs(req, res) {
  collegeDataModule
    .getTAs()
    .then(function (response) {
      res.json(response);
    })
    .catch(function () {
      res.json({ message: 'no results' });
    });
}

function handleCourses(req, res) {
  collegeDataModule
    .getCourses()
    .then(function (response) {
      res.json(response);
    })
    .catch(function () {
      res.json({ message: 'no results' });
    });
}

function handleaddStudent(req, res) {
  const payload = req.body;
  collegeDataModule
    .addStudent(payload)
    .then(function () {
      res.redirect('/students');
    })
    .catch(function () {
      res.redirect('/students');
      console.log('Error while inserting student');
    });
}

app.get('/students', handleStudents);
app.get('/student/:num', handleStudent);
app.post('/students/add', handleaddStudent);
app.get('/tas', handleTAs);
app.get('/courses', handleCourses);
app.get(['/', '/home'], function (req, res) {
  const home = path.join(__dirname, 'views', 'home.html');
  res.sendFile(home);
});
app.get('/about', function (req, res) {
  const about = path.join(__dirname, 'views', 'about.html');
  res.sendFile(about);
});
app.get('/htmlDemo', function (req, res) {
  const htmlDemo = path.join(__dirname, 'views', 'htmlDemo.html');
  res.sendFile(htmlDemo);
});
app.get('/addStudent', function (req, res) {
  const addStudent = path.join(__dirname, 'views', 'addStudent.html');
  res.sendFile(addStudent);
});

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found on the server</h1>');
});
// setup http server to listen on HTTP_PORT
collegeDataModule
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, () => {
      console.log('server listening on port: ' + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log(err);
  });

// #required_module
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Socket = require('./io/io');
const Users = require('./models/Users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use("/public", express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

Users.find()
    .then(users => {
        new Socket(io, users);
    })
    .catch(error => {throw new Error(error)});

mongoose
  .connect(process.env.URL_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
	  console.log("starting the database");
    server.listen(process.env.PORT, () => {
      console.log("Starting the server");
    });
  })
  .catch(error => {throw new Error(error)});
  
  /*
	add user
		const newUser = new Users({user_id: یک کد ده رقمی بزن , state: پیش فرض فالس هست});
		newUser.save().then(user => console.log(user)).catch(err => console.log(err));
  */

/* 
Doumention
____________
    -- process.env => going to > .env < file
    -- قبل از انتشار بک اند برروی هاست حتما مقدار یوآرال دیتابیس را تغییر دهید
    -- getStarted => for starting add user to chat -> for example -> socket.emit("getStarted", user_id);
*/
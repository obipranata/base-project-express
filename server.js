const responseHelper = require('express-response-helper').helper();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express()

let corsOption = {
  origin: "http://localhost:8081"
}

const Role = db.role;
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db');
//   initial()
// });

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}

app.use(cors(corsOption));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(responseHelper);

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.respond('Welcome to my apps')
})

app.get('/404', function (req, res) {
  res.failNotFound("Halaman tidak ditemukan");
});

app.get('/user', async (req, res) => {
  const users = await db.User.findAll();
  res.respond({
    message: "berhasil",
    data: users,
  })
})

// set port, listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

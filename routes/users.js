var express = require('express');
var router = express.Router();
const {createUser, logIn} = require("./userController")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-user", createUser)

router.post("/log-in", logIn)

module.exports = router;

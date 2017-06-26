const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const data = require('./userData.js');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


// functions to authenticate, make sure to call these in the right place

function authenticate(req) {
  var username = req.body.username;
  var password = req.body.password;
  var authenticatedUser = data.users.find(function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
    } else {
      return false
    }
  });
  return req.session;
}

function checkAuthentication(req, res, username){
  if (req.session && req.session.authenticated){
    console.log("Login successful");
    return res.render('index', { username : req.body.username });
  } else {
    console.log("Invalid login");
    return res.render('login');
  }
}

function logout(req, res){
  req.session.authenticated = false;
  return res.render('login');
}

// check and see if user is authenticated at root, if not, redirect to login

app.get('/', function(req, res, username) {
  checkAuthentication(req, res, username);
});

app.get('/login', function(req, res) {
  res.render('login');
});


app.post('/', function(req, res){
  authenticate(req, res);
  checkAuthentication(req, res);
});

app.post('/logout', function(req, res){
  logout(req, res);
})

app.listen(3000, function(){
  console.log('Started express application!')
});

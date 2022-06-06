const { request } = require('express');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/FrontPage.ejs'));
});


app.post('/auth', (req, res) => {
  let username = req.body.Username;
  let password = req.body.Password;

  if (username && password){
    connection.query('SELECT * from users WHERE user_name = ? AND user_pass = ?', [username,password], function (error, results, fields) {
      if (error) throw error;
      if(results.length > 0){
        request.session.loggedin = true;
        request.session.username = username;
        request.session.id = `SELECT id from users WHERE user_name = '${username}'`;
        response.redirect('/')
      } else{
        response.send('Inncorect Username and/or Password!');
      }
      response.end();
    });
  } else{
    response.send('Please Enter Username and Password');
    response.end();
  }
})
app.listen(3000)

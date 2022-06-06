/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/

var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'thought-spot-db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

//Update to depend on whether logged in or not
app.get('/', function(req, res) {
	//console.log("loggedIn: " + req.cookies.loggedIn)
	if(req.cookies.loggedIn == 'true'){
		//console.log("homepage userID: " + req.cookies.userID);
		var getJournals = `SELECT * FROM journal_entries WHERE entry_user='${req.cookies.userID}'`;
		db.task('get-everything', task => {
			return task.any(getJournals);
		})
		.then(data => {
			//console.log('homepage journal data: ')
			//console.log(data)
			res.render('homePage',{
				journals: data,
				accountImg: null,
			});
		})
		.catch( err => {
			console.log('home page error', err);
			res.render('homePage', {
				journals: null,
				accountImg: null,
			});
		});
		
	} else {
		res.render('FrontPage',{
			journals: null,
			accountImg: null,
		});
	}
});

app.get('/homePage', function(req, res) {
	// if(req.cookies.loggedIn === 'true'){
		//console.log("homepage userID: " + req.cookies.userID);
		var getJournals = `SELECT * FROM journal_entries WHERE entry_user='${req.cookies.userID}'`;
		db.task('get-everything', task => {
			return task.any(getJournals);
		})
		.then(data => {
			//console.log('homepage journal data: ')
			console.log(data)
			res.render('homePage',{
				journals: data,
				accountImg: null,
			});
		})
		.catch( err => {
			console.log('home page error', err);
			res.render('homePage', {
				journals: null,
				accountImg: null,
			});
		});
		
	// } else {
	// 	res.render('frontPage',{
	// 		journals: null,
	// 		accountImg: null,
	// 	});
	// }
});

app.get('/user_settings', function(req, res) {
	if(req.cookies.loggedIn === 'true'){
		user = `SELECT account_name FROM accounts WHERE account_id='${req.cookies.userID}';`;
		email = `SELECT account_email FROM accounts WHERE account_id='${req.cookies.userID}';`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(user),
				task.any(email)
			]);
		})
		.then(data => {
			console.log(data[0][0])
			console.log(data[1][0])
			
			console.log('curruser cookie:')
			console.log(req.cookies.curruser)
			res.render('user_settings', {
				curruser: req.cookies.curruser,
				curremail: req.cookies.curremail,
			});
		})
		.catch(err => {
			console.log('user_settings error', err);
			res.render('user_settings', {
					curruser: data[0][0].account_name,
					curremail: data[0][1].account_email,
				});
			})
		}
	else{
		res.render('FrontPage');
		// res.send("You must be logged in to take this action.");
		// res.end();
		//loginAlert();
//		res.render('FrontPage');
	}
});

app.post('/user_settings/chuser', function(req,res) {
	if(req.cookies.loggedIn === 'true'){
        var newusername = req.body.new_username;
        var oldusername = req.body.current_username;
		updateUsername = `UPDATE accounts SET account_name = REPLACE(account_name, '${oldusername}', '${newusername}') WHERE account_name = '${oldusername}';`;
		db.task('get-everything', task => {
			return task.any(updateUsername)
		})
		.then(data => {
			res.cookie('curruser', newusername)
			res.render('user_settings', {
				curruser: newusername,
				curremail: req.cookies.curremail,
			});
		})
		.catch(err => {
			console.log('settings error', err);
            res.render('user_settings')
		});
	}
	else{
		//loginAlert();
		res.render('FrontPage');
		// res.send("You must be logged in to take this action.");
		// res.end();

	}
});
app.post('/user_settings/chpass', function(req,res) {
	if(req.cookies.loggedIn === 'true'){
        var newpassword = req.body.new_password;
        var oldpassword = req.body.current_password;
		updatePassword = `UPDATE accounts SET account_password = REPLACE(account_password, '${oldpassword}', '${newpassword}') WHERE account_password = '${oldpassword}';`;
		db.task('get-everything', task => {
			return task.any(updatePassword)
		})
		.then(data => {
			res.render('user_settings', {
				curruser: req.cookies.curruser,
				curremail: req.cookies.curremail,
			});
		})
		.catch(err => {
			console.log('settings error', err);
            res.render('user_settings')
		});
	}
	else{
		res.render('FrontPage');
		// res.send("You must be logged in to take this action.");
		// res.end();
	}
});

app.post('/user_settings/chemail', function(req,res) {
	if(req.cookies.loggedIn === 'true'){
        var newemail = req.body.new_email;
        var oldemail = req.body.current_email;
		updateEmail = `UPDATE accounts SET account_email = REPLACE(account_email, '${oldemail}', '${newemail}') WHERE account_email = '${oldemail}';`;
		db.task('get-everything', task => {
			return task.any(updateEmail)
		})
		.then(data => {
			res.cookie('curremail', newemail)
			res.render('user_settings', {
				curruser: req.cookies.curruser,
				curremail: newemail,
			});
		})
		.catch(err => {
			console.log('settings error', err);
            res.render('user_settings')
		});
	}
	else{
		res.render('FrontPage');
		// res.send("You must be logged in to take this action.");
		// res.end();
	}
});

app.post('/user_settings/remove', function(req,res) {
	if(req.cookies.loggedIn === 'true'){
		var user = `SELECT account_name FROM accounts WHERE account_id = '${req.cookies.userID}';`;
		var deleteAccount = `DELETE from accounts WHERE account_id = '${req.cookies.userID}';`;
		var deleteJournals = `DELETE from journal_entries WHERE entry_user = '${user}';`;
		db.task('get-everything', task => {
			return task.any(deleteAccount)
		})
		.then(data => {
			res.cookie('curruser', 'none')
			res.cookie('curremail', 'none')
			res.cookie('loggedIn', 'false');
			res.render('deletion');
		})
		.catch(err => {
			console.log('settings error', err);
            res.render('user_settings')
		});
	}
	else{
		res.render('FrontPage');
		// res.send("You must be logged in to take this action.");
		// res.end();
	}
});


// app.post('/user_settings', function(req,res) {
//     if(req.cookies.loggedIn == 'true'){
//         var newusername = req.body.new_username;
//         var oldusername = req.body.current_username;
//         var newpassword = req.body.new_password;
//         var oldpassword = req.body.current_password;
//         var newemail = req.body.new_email;
//         var oldemail = req.body.current_email;
//         updateUsername = `UPDATE accounts SET account_name = REPLACE(account_name, '${oldusername}', '${newusername}') WHERE account_name = '${oldusername}';`;
//         updatePassword = `UPDATE accounts SET account_password = REPLACE(account_password, '${oldpassword}', '${newpassword}') WHERE account_password = '${oldpassword}';`;
//         updateEmail = `UPDATE accounts SET account_email = REPLACE(account_email, '${oldemail}', '${newemail}') WHERE account_email = '${oldemail}';`;
        
//         db.task('get-everything', task => {
//             return task.batch([
//             task.any(updateUsername),
//             task.any(updatePassword),
//             task.any(updateEmail)
//             ]);
//         })
//         .then(data => {
//             res.render('user_settings')
//         })
//         .catch(err => {
//             console.log('settings error', err);
//             res.render('user_settings')
//         });
//     }
// });

//may need multiple of these for different things
// app.post('/user_settings', function(req, res) {
// 	res.render('user_settings')
// });

app.get('/new_entry', function(req, res) {
	res.render('new_entry',{
		journals: null,
		accountImg: null,
	})
});

app.post('/new_entry', function(req, res) {
	var date = req.body.date;
	var time = req.body.time;
	var mood = req.body.mood;
	var mood_word = req.body.moodword;
	var entry = req.body.entry;
	var userID = req.cookies.userID
	//console.log("\nnew_entry userID: " + userID +"\n");
	//console.log(date);
	//console.log(time);
	//console.log(mood);
	//console.log(mood_word);
	//console.log(entry);
	//console.log("\n\n\n\n\n");

	var insert_statement = `INSERT INTO journal_entries(entry_date, entry_time, entry_user, entry_mood, entry_mood_word, entry_description) VALUES ('${date}','${time}', '${userID}' ,'${mood}','${mood_word}','${entry}');`;
	var getJournals = `SELECT * FROM journal_entries WHERE entry_user='${req.cookies.userID}'`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement),
			task.any(getJournals)
        ]);
	})
	.then( data => {
		console.log(data)
		res.render('homePage',{
		journals: data[1],
		accountImg: null,
		})
	})
	.catch( err => {
		console.log('new entry error', err);
		res.render('homePage')
	});
});

//Registration Page 
app.get('/registration', function(req, res) 
{
	res.render('registration')
});

app.post('/registration', function(req, res) 
{
	var account_name = req.body.name;
	var account_password = req.body.password;
	var account_email = req.body.email;

	//console.log('account_name: ' + account_name);
	//console.log('account_pw: ' + account_password);
	//console.log('account_email: ' + account_email);
	var insert_statement = `insert into accounts(account_name, account_password, account_email) values ('${account_name}','${account_password}', '${account_email}');`;
	var getID = `select account_id from accounts where account_email='${account_email}';`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement),
			task.any(getID)
        ]);
	})
	.then(data => {
		res.cookie('userID', data[1][0].account_id);
		res.cookie('loggedIn', 'true');
		res.cookie('curruser', account_name)
		res.cookie('curremail', account_email)
		res.render('confirmation',{
			journals: [],
			accountImg: null,
		})
	})
	.catch( err => {
		console.log('registration submit error', err);
		res.render('/',{
			journals: null,
			accountImg: null,
		})
	});
});


app.get('/JournalEntry/:id', function(req, res) {
	var id = req.params.id
	var entry = `select * from journal_entries where entry_id = '${id}'`;
	db.task('get-everything', task => {
		return task.any(entry);
	})
	.then( data => {
		console.log(data[0])
		res.render('JournalEntry', {
			entry: data[0]
		})
	})
	
});

app.get('/FrontPage', function(req, res) 
{
	res.clearCookie("loggedIn");
    res.clearCookie("userID");
	res.render('FrontPage')
});


app.post('/auth', (req, res) => {
	console.log("Entered auth");
	let username = req.body.Username;
	let password = req.body.Password;
	console.log(username);
	console.log(password);
	//var select_statement = 'SELECT * from accounts WHERE account_name = ? AND account_password = ?'
	var getJournals = `SELECT * FROM journal_entries WHERE entry_user= (SELECT account_id from accounts WHERE account_name = '${username}' AND account_password = '${password}')`;
	if (username && password){
		// db.task('get-everything', task => {
		// 	return task.any(select_statement);
		// })
		
		/*db.any(`SELECT * from accounts WHERE account_name = '${username}' AND account_password = '${password}'`)
			.then(function(users){
				db.task('get-everything', task => {
					return task.any(getJournals)
				})
				.then(data => {
					console.log(data);
					res.render('homePage', {
						journals: data,
						accountImg: null,
					})
				})
				
			})*/
		db.task('get-everything', task => {
			return task.batch([
				task.any(`SELECT * from accounts WHERE account_name = '${username}' AND account_password = '${password}'`),
				task.any(getJournals)
			]);
		})
		.then(data => {
			if(data[0].length == 0){
				res.render('FrontPage')
			} else{
				res.cookie('userID', data[0][0].account_id);
				res.cookie('loggedIn', 'true');
				res.cookie('curruser', username)
				res.cookie('curremail', data[0][0].account_email)
				res.render('homePage',{
					journals: data[1],
					accountImg: null,
				})
			}
		})
		.catch( err => {
			console.log('registration submit error', err);
			res.render('/',{
				journals: null,
				accountImg: null,
			})
		});
	// 	if (error) throw error;
	// 	if(results.length > 0){
	// 	//   request.session.loggedin = true;
	// 	//   request.session.username = username;
	// 	//   request.session.id = `SELECT id from accounts WHERE account_name = '${username}'`;
	// 	console.log("DB success")
	// 	response.render('/')
	// 	} else{
	// 	  response.send('Inncorect Username and/or Password!');
	// 	}
	// 	response.end();
	//   });
	} else{
		res.render('FrontPage')
	}
  })

//app.listen(3000);
const server = app.listen(process.env.PORT || 8008, () => {
	console.log(`Express running → PORT ${server.address().port}`);
  });
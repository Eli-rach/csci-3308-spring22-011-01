app.get('/', valadateCookie, function(req, res) {

	// res.cookie('UserID', '<UserID>');
	var query1 = `select * from journal_entries where entry_user = '${req.cookie.UserID}'`;
	var query2 = `select account_img from accounts where account_id = '${req.cookie.UserID}'`;
	db.task('get-everything', task => {
        return task.batch([
            task.any(query1),
            task.any(query2)
        ]);
    })
	.then(info => {
    	res.render('homePage', {
			accountImg: info[1],
			journals: info[0],
		});
    })
    .catch(err => {
        // display error message in case an error
            console.log('error', err);
            response.render('homePage', {
				accountImg: null,
				journals: null,
            })
    });	
});

app.post('/homePage/pickJournal', function(req, res){
	let journalPick = req.query.journal_selection;
	var getJournal = `select * from journal_entries where entry_id = '${journalPick}' and entry_user = '${req.cookie.UserID}'; `;
	var getAccountImg = `select account_img from accounts where account_id = '${req.cookie.UserID}'`;
	db.task('get-everything', task => {
        return task.batch([
            task.any(getJournal),
            task.any(getAccountImg)
        ]);
	}).then(info =>{
		res.render('<lookAtJournalWebName>', {//rename
			accountImg:info[1],
			journalContent:info[2]
		}) 
	})
});



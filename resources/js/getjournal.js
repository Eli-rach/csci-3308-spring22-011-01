function getJournal(id) {
    
    console.log('inside getJournal')
    console.log(id)
    var action = '/JournalEntry/' + id
    document.getElementById('journals').action = action;
}
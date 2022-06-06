
const timeVal = "10:00";
const dateVal = "4/8/2022";
const moodVal = 9
const moodDesc = "Happy"
const journalTextVal = "Journal Text: Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile-first projects on the web."
const entryNumVal = 1


function loadJournalEntry(data){
  console.log("loadJournalEntry data: ")
  console.log(data.entry_time)
  document.getElementById('journalTime').innerHTML = data.entry_time;
  document.getElementById('journalDate').innerHTML = data.entry_date;
  document.getElementById('journalMood').innerHTML = data.entry_mood;
  document.getElementById('journalMoodDesc').innerHTML = data.entry_mood_word;
  document.getElementById('journalText').innerHTML = data.entry_description;
}

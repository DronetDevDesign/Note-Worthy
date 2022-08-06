// require express:
const express = require('express');
// require the data from the "db" folder containing "db.json"
const { notes } = require('./db/db');
// for heroku
const PORT = process.env.PORT || 3001;
// initiate the server:
const app = express();

// filterByQuery():
function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(notes => notes.title === query.title);  
  }
  if (query.text) {
    filteredResults = filteredResults.filter(notes => notes.text === query.text);
  }
  return filteredResults;
}

// add the routes for 'notes' array in 'db.json' file in 'db' folder:
// 1)
app.get('/api/notes', (req, res) => {
  res.json(notes);
});
// 2)
app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = notes.find(req.query, results);
  }
  res.json(results);
});




// make server listen:
app.listen(PORT, () => {
  console.log(`API server now on port 3001`);
});
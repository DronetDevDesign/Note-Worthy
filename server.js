// require express:
const express = require('express');
// require the data from the "db" folder containing "db.json"
const { notes } = require('./db/db');
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
  return filteredresults;
}

// add the routes:
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = notes.find(req.query, results);
  }
  res.json(results);
});




// make our server listen:
app.listen(3001, () => {
  console.log(`API server now on port 3001`);
});
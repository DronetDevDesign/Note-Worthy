// require express:
const express = require('express');
// require the data from the "db" folder containing "db.json"
const { notes } = require('./db/db');
// for heroku
const PORT = process.env.PORT || 3001;
// initiate the server:
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// filterByQuery():
function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(notes => notes.title === query.title);  
  }
  if (query.text) {
    filteredResults = filteredResults.filter(notes => notes.text === query.text);
  }
  if (query.id) {
    filteredResults = filteredResults.filter(notes => notes.id === query.id);
  }
  return filteredResults;
}

// findById():
function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

// add the routes for 'notes' array in 'db.json' file in 'db' folder:
// 1) GET request
app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// 2) GET request
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result); 
  } else {
    res.sendStatus(404);
  }
});

// 3) POST request:
app.post('/api/notes', (req, res) => {
  // req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
});




// make server listen:
app.listen(PORT, () => {
  console.log(`API server now on port 3001`);
});
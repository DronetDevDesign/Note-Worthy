const fs = require('fs');
const path = require('path');
// require express:
const express = require('express');
// require the data from the "db" folder containing "db.json"
let { notes } = require('./db/db');
// for heroku
const PORT = process.env.PORT || 3001;
// initiate the server:
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// include the public folder so ALL files in it can be accessed:
app.use(express.static('public'));

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

// create new note function:
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

// validation that both title and text have been entered:
function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
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
  // req.body is where our incoming content will be;
  // set ID based on what the next index of the array will be:
  req.body.id = notes.length.toString();
  // if any data in req.body is incorrect, send 404 error back:
  if (!validateNote(req.body)) {
    // res.status().send() is a response method to relay a message that something went wrong:
    res.status(404).send('Your NOTE is not properly formatted.');
  } else {
    // add note to json file and notes array in this function:
    const note = createNewNote(req.body, notes);

    res.json(note);
  }
});
// 4) GET request set for index.html page:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// 5) GET request set for notes.html page:
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});
// 6) DELETE route:
app.delete('/api/notes/:id', (req, res) => {
  const filteredItems = notes.filter(note => note.id != req.params.id);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: filteredItems }, null, 2)
  );
  notes = filteredItems;
  res.send();
});

// make server listen:
app.listen(PORT, () => {
  console.log(`API server now on port 3001`);
});
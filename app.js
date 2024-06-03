/**
 * Backend file setting up all necessary Express routes for the notes app. 
 */

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const NOTES_FILE = 'notes.json';
const MAX_NOTE_LENGTH = 30;

/**
 * Ensures that the query parameters passed into the get endpoint are valid. 
 * Returns a 403 error if the parameter is not allowed. 
 */

function validateQueryParams(req, res, next) {
    const allowedParams = ['date']; // Currently an array of 1. More can be added. 
    const queryParams = Object.keys(req.query);
    for (let param of queryParams) {
        if (!allowedParams.includes(param)) {
            return res.status(403).json({ error: `Invalid query parameter: ${param}` });
        }
    }

    next();
}

/**
 * Returns notes from the JSON file as an array of objects containing note text
 * and note dates. Can be filtered by date. 
 * Example: [{"text": "note text", "date": "2024-01-01"}]
 * Returns a 500 error if something goes wrong with the server. 
 */
app.get('/notes', validateQueryParams, (req, res) => {
    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read notes' });
            return;
        }

        let notes = JSON.parse(data);
        if (req.query.date) {
            notes = notes.filter(note => note.date === req.query.date);
        }
        res.json(notes);
    });
});

/**
 * Adds a new note to the notes.json file. 
 * Required POST parameters: text, date. 
 * Returns a 400 error if note text is too long (> 30 characters)
 * Returns a 500 error if something is wrong in file processing 
 * Responds with new note json if successful 
 */
app.post('/notes', (req, res) => {
    const { text, date } = req.body;
    const newNote = { text: text, date: date };

    if (text.length > MAX_NOTE_LENGTH) {
        res.status(400).json(
            { error: `Note exceeds max length of ${MAX_NOTE_LENGTH} characters` }
        );
        return;
    }

    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read notes' });
            return;
        }

        let notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(NOTES_FILE, JSON.stringify(notes), (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save note' });
                return;
            }
            res.status(200).json(newNote);
        });
    });
});

/**
 * Catch all 404 not found error for unknown endpoints 
 */
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

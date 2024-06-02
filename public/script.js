/**
 * JS file setting up functions needed for the client side of the notes app. 
 */

(function() {
    "use strict";

    /**
     * Initializes interactivity on the page. 
     */
    async function init() {
        await loadNotes();

        qs('#note-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                await addNote();
                loadNotes();
            } catch (error) {
                handleError(error);
            }
        });

        qs('#filter-button').addEventListener('click', async () => {
            try {
                await filterNotes();
            } catch (error) {
                handleError(error);
            }
        });

        qs('#show-all').addEventListener('click', async (event) => {
            event.preventDefault();
            loadNotes();
        });
    }

    /**
     * Loads all notes made. 
     */
    async function loadNotes() {
        if(qs('.error')) {
            qs('.error').remove(); 
        }
        try {
            let response = await fetch('/notes');
            await checkStatus(response);
            let notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Adds a note. 
     */
    async function addNote() {
        if(qs('.error')) {
            qs('.error').remove(); 
        }
        let noteText = qs('#note-text').value;
        let noteDate = qs('#note-date').value;
        let response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: noteText, date: noteDate })
        });
        await checkStatus(response);
    }

    /**
     * Given an array of notes, displays them onscreen.
     * @param {Array} notes 
     * @returns None 
     */
    function displayNotes(notes) {
        const container = qs('#notes-container');
        container.innerHTML = '';
        if (!notes.length) {
            handleError(new Error('No notes found on that date'));
            return;
        }
        notes.forEach(note => {
            let noteDiv = gen('div');
            noteDiv.classList.add('note');
            let noteDate = gen('h2');
            noteDate.textContent = `${note.date}`;
            let noteText = gen('p');
            noteText.textContent = `${note.text}`;
            noteDiv.appendChild(noteDate);
            noteDiv.appendChild(noteText);
            container.appendChild(noteDiv);
        });
    }

    /**
     * Fetches notes from a certain date and displays them. 
     */
    async function filterNotes() {
        if(qs('.error')) {
            qs('.error').remove(); 
        }
        let filterDate = qs('#filter-date').value;
        let response = await fetch(`/notes?date=${filterDate}`);
        await checkStatus(response);
        let notes = await response.json();
        displayNotes(notes);
    }

    /**
     * Creates an error message for the user
     * @param {Error} error - error object with error message.
     */
    function handleError(error) {
        const container = qs('#error-space');
        let p = gen('p');
        p.textContent = `Error: ${error.message}`;
        p.classList.add('error');
        container.appendChild(p);
    }

    /**
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
    async function checkStatus(response) {
        if (!response.ok) {
            let errorMessage = 'Error';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `This is REALLY bad (${e})`;
            }
            throw new Error(errorMessage);
        }
        return response;
    }

    init();
})();

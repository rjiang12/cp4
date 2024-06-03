# Notes app API Documentation
This API is designed to manage notes, allowing users to retrieve and create notes. Shared behavior includes 500 error handling for any internal server errors.

## *Fill in Endpoint 1 (GET text/plain Example)*
**Request Type:** *Fill in request type*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Supported Parameters** *List any optional/required parameters*

**Example Request:** *Fill in example request(s)*

**Example Response:**
*Fill in example response in the ticks*

```

```

**Error Handling:**
*Summarize any possible errors a client should know about*
*Fill in at least one example of the error handling*

## GET /notes
**Request Format:** /notes or /notes?date=:date

**Returned Data Format**: JSON

**Description:** Fetches all written notes or specific note(s) written on a specific date if filter date is provided. 

**Supported Parameters** *List any optional/required parameters and defaults*
* `date` (optional)
  * Only gets notes written on a particular date (YYYY-MM-DD)

**Example Request:** 
```javascript
fetch('/notes')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
[
  {
    "text": "Note 1",
    "date": "2024-05-01"
  },
  {
    "text": "Note 2",
    "date": "2024-05-02"
  }
]
```

**Error Handling:**
* 403 Forbidden Error if invalid parameter is passed in (any parameter that is not `date` or nothing)
```json
{
    "error": "Invalid query parameter: text"
}
```
* 500 Internal Server Error (aside: I actually don't think the way the app is constructed that this can happen unless your server was off)
```json
{
  "error": "Failed to read notes"
}
```

## POST /note
**Request Format:** /notes 

**Returned Data Format**: JSON

**Description:** Creates a new note with the provided text and date.

**Supported Parameters** *List any optional/required parameters*
* POST body parameters:
    * `text` (required): Text of the note. Max length of 30 characters. 
    * `date` (required): Date of the note (YYYY-MM-DD)

**Example Request:** 
```javascript
fetch('/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'This is a new note',
    date: '2024-06-02'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Example Response:**
```json
{
  "text": "This is a new note",
  "date": "2024-06-02"
}
```

**Error Handling:**
* 400 Bad Request Error - occurs if the note is longer than the 30-character maximum. 
```json
{
  "error": "Note exceeds max length of 30 characters"
}
```
* 500 Internal Server Error - occurs if the server cannot read or save the note. (Aside: again, probably only occurs if the server is not on.)
```json
{
  "error": "Failed to read notes"
}
```
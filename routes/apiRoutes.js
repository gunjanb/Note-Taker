// read notes from DB for which we need db file
const notesfromdb = require("../db/db.json");
//we need to include uuid package to create a unique id for notes
const { v4: uuidv4 } = require("uuid");
// We need to include the path package to get the correct file path for our DB file
const path = require("path");
//we need to include fs module to interact with file system
const fs = require("fs");

// ROUTING
module.exports = (app) => {
  // API GET Requests
  // Below code handles when users "visit" a page called notes then
  // all notes from db is retrived and shown on leftside column

  app.get("/api/notes", (req, res) => res.json(notesfromdb));

  // API POST Requests
  // Below code handles when a user saves a note and thus submits data to the server.
  // (ex. User writes a note and click on save notes button then this data is sent to the server and
  // then the server saves the data to the db.json file)

  app.post("/api/notes", (req, res) => {
    // req.body is available since we're using the body parsing middleware
    let saveNote = req.body;
    //console.log("data from user ", req.body);

    // add id to the note before storing it in db.json file
    let newNote = {
      id: uuidv4(),
      title: saveNote.title,
      text: saveNote.text,
    };

    notesfromdb.push(newNote);

    // write all notes to .json file means adding to a database
    fs.writeFileSync(
      path.join(__dirname, "../db/db.json"),
      JSON.stringify(notesfromdb, null, 2)
    );

    res.json(true);
  });

  //API DELETE Request

  app.delete("/api/notes/:id", (req, res) => {
    //extract note id to be deleted
    const deleteNoteWithId = req.params.id;

    //console.log("All notes from DB:", notesfromdb);

    //will return index if note is available  in
    //if not present then return -1
    const deleteNoteAtIndex = notesfromdb.findIndex(
      (note) => note.id === deleteNoteWithId
    );

    if (deleteNoteAtIndex > -1) {
      //delete at index and remove only one item
      notesfromdb.splice(deleteNoteAtIndex, 1);

      //write the updated notes to db
      fs.writeFileSync(
        path.join(__dirname, "../db/db.json"),
        JSON.stringify(notesfromdb, null, 2)
      );
      res.json(true);
    } else {
      console.error(`Tried to delete a Note which doesn't exist!`);
      res.json(false);
    }
  });
};

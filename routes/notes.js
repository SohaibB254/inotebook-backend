const express = require('express');
const Router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes')
const { body, validationResult } = require("express-validator");//npm package
// Route 1: Get all the notes of a user using: GET "/api/notes/fetchallnotes". Fetches all notes to perform CRUD operations-Login required
Router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

// Route 2: Add a new note using: POST "/api/notes/addnote".-Login required
Router.post('/addnote', fetchuser, [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 20 characters").isLength({
        min: 5,
    }),
], async (req, res) => {
    try {
        
        
        const { title, description, tag } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Note not saved");
    }
})
// Route 3: Updating an exsisting note  using: PUT "/api/notes/updatenote".-Login required
Router.put('/updatenote/:id', fetchuser,async (req, res) => {
    const {title, description, tag} = req.body;
    //Create a new note after updation
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}
    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send('Note not found😢')}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send('Not Allowed')
    }
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{new:true});
    res.json(note);
    

})
// Route 4: Deleting an exsisting note  using: DELETE "/api/notes/deletenote".-Login required
Router.delete('/deletenote/:id', fetchuser,async (req, res) => {
    try {
    //find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send('Note not found')}
    //Only Allow to delete if user own the note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send('Not Allowed')
    }
    note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been Deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
    }
    

})
module.exports = Router;
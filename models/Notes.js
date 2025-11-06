const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    //using the user model as a foreign key to get user's id to give access to all the notes in their account
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    tag:{
        type: String,
        default: 'Basic'
    },
    date:{
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', NotesSchema)
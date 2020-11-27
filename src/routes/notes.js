const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please write a title' });
    }
    if (!description) {
        errors.push({ text: 'Please write a description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id; //Passport saves in an object the authenticated user information
        await newNote.save();
        req.flash('success_msg', 'Note added Sucessfully'); //Send to messages to users
        res.redirect('/notes');
    }

});

router.get('/notes', isAuthenticated, async(req, res) => {
    await Note.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(data => {
            const notes = data.map(note => {
                return { id: note.id, title: note.title, description: note.description }
            });
            res.render('notes/all-notes', { notes });
        });
});

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    await Note.findById(req.params.id)
        .then(data => {
            const note = { id: data.id, title: data.title, description: data.description };
            res.render('notes/edit-note', { note });
        });
});

router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;

    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Note Updated Sucessfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Sucessfully');
    res.redirect('/notes');
});

module.exports = router;
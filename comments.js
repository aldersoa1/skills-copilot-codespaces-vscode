// Create web server

// Import module
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Comment } = require('../models/comment');

// Create router object
const router = express.Router();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Connect to database
mongoose.connect('mongodb://localhost:27017/express-demo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Define routes
router.get('/', async (req, res) => {
    const comments = await Comment.find().sort('name');
    res.send(comments);
});

router.post('/', urlencodedParser, async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    });
    await comment.save();
    res.send(comment);
});

router.put('/:id', urlencodedParser, async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    }, { new: true });
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.send(comment);
});

router.delete('/:id', async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.send(comment);
});

router.get('/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.send(comment);
});

// Export router object
module.exports = router;
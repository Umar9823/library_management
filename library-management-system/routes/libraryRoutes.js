const express = require('express');
const path = require('path');
const multer = require('multer');
const admin = require('firebase-admin');
const sendMail = require('../utils/sendMail');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'), // Change the path if needed
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Route: Serve issueForm.html from public folder
router.get('/formissue', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'issueForm.html'));
});

// Route: Handle Book Issue
router.post('/issueBook', upload.single('bookImage'), async (req, res) => {
    try {
        const { title, author, name, email, phone } = req.body;

        const newBook = {
            title,
            author,
            user: { name, email, phone },
            returnDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)), // 8 days from now
            isReturned: false,
        };

        await req.db.collection('books').add(newBook);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error issuing book: ' + error.message);
    }
});

module.exports = router;

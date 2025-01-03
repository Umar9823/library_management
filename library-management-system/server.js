const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const libraryRoutes = require('./routes/libraryRoutes');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase/librarymanagement-18156-firebase-adminsdk-cnnl6-bee3edc49c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://librarymanagement-18156.firebaseio.com", // Replace with your Firebase database URL
});

const db = admin.firestore();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Pass Firestore instance to routes
app.use((req, res, next) => {
    req.db = db;
    next();
}, libraryRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

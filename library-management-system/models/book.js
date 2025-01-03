const admin = require('firebase-admin');
const db = admin.firestore();
const booksCollection = db.collection('books');

// Adding a New Book
async function addBook(bookData) {
    const book = {
        title: bookData.title,
        author: bookData.author,
        issuedDate: admin.firestore.Timestamp.now(),
        returnDate: admin.firestore.Timestamp.fromDate(new Date(bookData.returnDate)),
        user: {
            name: bookData.user.name,
            email: bookData.user.email,
            phone: bookData.user.phone,
        },
        finePerDay: bookData.finePerDay || 10,
        isReturned: bookData.isReturned || false,
    };

    await booksCollection.add(book);
    console.log('Book added successfully');
}

// Fetching Books
async function getBooks() {
    const snapshot = await booksCollection.get();
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(books);
    return books;
}

// Updating a Book
async function updateBook(bookId, updatedData) {
    await booksCollection.doc(bookId).update(updatedData);
    console.log('Book updated successfully');
}

// Deleting a Book
async function deleteBook(bookId) {
    await booksCollection.doc(bookId).delete();
    console.log('Book deleted successfully');
}

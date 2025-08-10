//import mongoose from 'mongoose';
const express = require('express'); // Install: $ npm install express
const app = express();
const cors = require('cors'); // Install: $ npm install cors
const port = 8887;

const mongoose = require('mongoose'); // Install: $ npm install mongoose
mongoose.set('strictQuery', true);

const connectionString = 'mongodb://0.0.0.0:27017/bad';

// These will be gotton from Front End and provided by the user.
let schemaName = "TODO";
let databaseName = "TODO";

// Connection event handlers
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Error
// .once means it will do this 1 time
db.once('open', () => {
    // Create Mongoose schema
    // This is property: value
    const mainSchema = new mongoose.Schema({
        question: String,
        answer: String
    });

    // Create a document:
    // This will be collection, schema
    const newCollection = mongoose.model(schemaName, mainSchema); // Note, by default it makes collection name all lowercase.
    connectionString = `mongodb://0.0.0.0:27017/${databaseName}}`;

    // Connect to DB
    mongoose.connect(connectionString);
    const db = mongoose.connection;
    console.log('Connected to MongoDB successfully!');

    // Create database and collection names based on input
    app.get('/create-storage', async (req, res) => {
        try {
            res.json({
                success: true,
                message: 'Database and Collection created successfully!',
            });
            console.log('Schema created:', mainSchema);

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
            console.error('Error in creating db and collection:', error);
        }
    });
});

app.use(express.json());
app.use(cors());

// Route to get all test documents
app.get('/get-tests', async (req, res) => {
    try {
        const docs = await newCollection.find({});
        res.json({ success: true, documents: docs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => console.log(`Server running at localhost: ${port}!`))

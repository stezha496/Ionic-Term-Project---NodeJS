const express = require('express'); // Install: $ npm install express
const app = express();
const cors = require('cors'); // Install: $ npm install cors
const port = 8887;

const mongoose = require('mongoose'); // Install: $ npm install mongoose
mongoose.set('strictQuery', true);

app.use(express.json());
app.use(cors());

// Schema structure based on mainSchema from original file
const mainSchema = new mongoose.Schema({
    Question: String,
    Answer: String
});

let connectionString = null;
let created = false;
let collection = null;

// Create db and schema
app.post('/create-storage/', async (req, res) => {
    // console.log("create-storage running");
    console.log(req.body);
    try {
        const { databaseName, schemaName } = req.body;
        // Validate input
        // TODO: remove .status() and throw a error instead.
        if (!databaseName || !schemaName) {
            return res.status(400).json({
                success: false,
                message: 'Database name and schema name are required'
            });
        }
        else if (created) {
            return res.status(400).json({
                success: false,
                message: 'Storage has already been created'
            });
        }

        // Connect to the specific database and create model
        connectionString = `mongodb://localhost:27017/${databaseName}`;
        collection = mongoose.model(schemaName, mainSchema);

        // Connect to DB
        mongoose.connect(connectionString);
        const db = mongoose.connection;
        db.on('error', (err) => { console.log(err); });

        // console.log(`Created model: ${schemaName} in database: ${databaseName}`);

        created = true;

    } catch (error) {
        console.error('Error in create-storage:', error);
    }
});

// Batch insert from file
app.post('/batch-insert/', async (req, res) => {
    const inputData = req.body;
    try {
        collection.insertMany(inputData)
            .then(result => {
                res.send({
                    "message": result.length + " Records added"
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    catch (error) {
        console.error('Error in insert many-storage:', error);
    }
});

// Delete all
app.delete('/delete-all/', async (req, res) => {
    try {
        collection.deleteMany(req.query).then(result => {
            res.send({ "message": result.deletedCount });
        })
            .catch(err => {
                console.log(err);
            });
    }
    catch (error) {
        console.error('Error in delete all:', error);
    }
});

// Get all
app.get('/get-all/', async (req, res) => {
    try {
        console.log("get-all running");
        collection.find(req.query).then(result => {
            res.send(result);
            console.log(result);
        })
            .catch(err => {
                console.log(err);
            });
    }
    catch (error) {
        console.error('Error in get all:', error);
    }
});

// Update a item
app.put('/update', (req, res) => {
    try {
        console.log("update running");
    }
    catch (error) {
        console.error('Error in update:', error);
    }
});

app.listen(port, () => console.log(`Server running at localhost: ${port}!`));
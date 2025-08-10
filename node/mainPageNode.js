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

        console.log(`Created model: ${schemaName} in database: ${databaseName}`);

        // res.status(201).json({
        //     message: `Successfully created storage for database: ${databaseName}, schema: ${schemaName}`,
        //     databaseName,
        //     schemaName
        // });

        created = true;

    } catch (error) {
        console.error('Error in create-storage:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
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
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Delete all
app.delete('/delete-all/', async (req, res) => {
    // db.collectionName.deleteMany({}) should delete all documents in a collection but keep the collection itself.
    // Since nothing is sent, req.query should == some kind of {}.
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

app.listen(port, () => console.log(`Server running at localhost: ${port}!`));
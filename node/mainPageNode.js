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
    question: String,
    answer: String
});

let connectionString = null;
let created = false;

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
        const newCollection = mongoose.model(schemaName, mainSchema);

        // Connect to DB
        mongoose.connect(connectionString);
        const db = mongoose.connection;

        db.on('error', (err) => { console.log(err); });

        console.log(`Created model: ${schemaName} in database: ${databaseName}`);

        res.status(201).json({
            success: true,
            message: `Successfully created storage for database: ${databaseName}, schema: ${schemaName}`,
            databaseName,
            schemaName
        });

        created = true;

    } catch (error) {
        console.error('Error in create-storage:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }

});
app.listen(port, () => console.log(`Server running at localhost: ${port}!`));
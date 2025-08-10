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

// let databaseName = null;
// let schemaName = null;
let connectionString = null;

app.post('/create-storage', async (req, res) => {
    try {
        const { databaseName, schemaName } = req.body;

        // Validate input
        if (!databaseName || !schemaName) {
            return res.status(400).json({
                success: false,
                message: 'Database name and schema name are required'
            });
        }

        // Connect to the specific database and create model
        connectionString = `mongodb://localhost:27017/${databaseName}`;
        const newCollection = mongoose.model(schemaName, mainSchema);

        // Connect to DB
        mongoose.connect(connectionString);
        const db = mongoose.connection;

        console.log(`Created model: ${schemaName} in database: ${databaseName}`);

        res.status(201).json({
            success: true,
            message: `Successfully created storage for database: ${databaseName}, schema: ${schemaName}`,
            databaseName,
            schemaName
        });

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
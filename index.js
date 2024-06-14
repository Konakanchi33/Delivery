const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Project';
// Collection Name
const collectionName = 'Music';

async function connectToDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(dbName);
}

// Enable CORS
app.use(cors());

// Route to get all music data
app.get('/music', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection(collectionName);
        const musicData = await collection.find().toArray();
        res.json(musicData);
    } catch (error) {
        console.error('Error fetching music data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to get music data by delivery ID
app.get('/music/:deliveryId', async (req, res) => {
    try {
        const deliveryId = parseInt(req.params.deliveryId);
        const db = await connectToDB();
        const collection = db.collection(collectionName);
        const musicData = await collection.findOne({ DeliveryID: deliveryId });

        if (!musicData) {
            res.status(404).json({ error: 'Delivery ID not found' });
            return;
        }

        res.json(musicData);
    } catch (error) {
        console.error('Error fetching music data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

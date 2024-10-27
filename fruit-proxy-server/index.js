const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();


app.get('/', async (req, res) => {
    try {
        const response = await axios.get(process.env.TARGET_URL);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.status(200).json(response.data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;

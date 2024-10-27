const express = require('express');
const axios = require('axios');  // Add this line

const app = express();

// CORS middleware
app.use((req, res, next) => {
    const allowedOrigins = ['https://fruit-proxy-server.vercel.app', 'http://localhost:5173'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws");
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;

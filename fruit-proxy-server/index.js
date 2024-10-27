const express = require('express');
const axios = require('axios');  // Add this line

const app = express();




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

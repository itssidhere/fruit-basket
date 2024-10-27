const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for your React app's origin
app.use(cors({
  origin: ['http://localhost:5173', 'https://fruit-basket-weld.vercel.app/']
}));

// Proxy endpoint
app.get('/fruits', async (req, res) => {
  try {
    const response = await axios.get(process.env.TARGET_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
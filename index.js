const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received JSON data:', data);

      // Echo back the received data
      ws.send(JSON.stringify({ message: 'Received', data }));
    } catch (error) {
      console.error('Invalid JSON received');
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/data', (req, res) => {
  try {
    const data = req.body;
    console.log('Received HTTP JSON data:', data);
    res.json({ message: 'Received', data });
  } catch (error) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const queues = {};

app.get('/api/queues/info', (req, res) => {
    const queueInfo = Object.keys(queues).map(name => ({ name, size: queues[name].length }));
    res.json(queueInfo);
});

app.get('/api/:queue_name', (req, res) => {
    const { queue_name } = req.params;
    res.json(queues[queue_name] || []);
});

app.post('/api/:queue_name', (req, res) => {
    const { queue_name } = req.params;
    const { message } = req.body;
    if (!queues[queue_name]) {
        queues[queue_name] = [];
    }
    queues[queue_name].push(message);
    res.status(201).send('Message added to queue');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
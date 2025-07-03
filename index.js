const express = require('express');
const app = express();

app.use(express.json()); // Middleware for parsing JSON

let items = [];
let currentId = 1;

// Root route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Get item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
});

// Validate item middleware
function validateItem(req, res, next) {
    const { name, description } = req.body;
    if (typeof name !== 'string' || typeof description !== 'string' || !name.trim() || !description.trim()) {
        return res.status(400).json({ error: 'Name and description are required and must be non-empty strings.' });
    }
    next();
}

// Create item
app.post('/items', validateItem, (req, res) => {
    const { name, description } = req.body;
    const newItem = { id: currentId++, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Update item
app.put('/items/:id', validateItem, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.name = req.body.name;
    item.description = req.body.description;
    res.json(item);
});

// Delete item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });
    items.splice(idx, 1);
    res.status(204).send();
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
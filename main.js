const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

// PostgreSQL connection setup
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "leemxy16",
    database: "DemoDB"
});

// Connect to Postgres
client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error", err.stack));

// Root route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get all users
app.get('/users', async(req, res) => {
    try {
        const result = await client.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Get user by ID
app.get('/users/:id', async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Create user
app.post('/users', async(req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email || typeof age !== 'number') {
        return res.status(400).json({ error: 'Invalid input: name, email, age are required' });
    }
    try {
        const result = await client.query(
            'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *', [name, email, age]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Update user
app.put('/users/:id', async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, email, age } = req.body;
    if (isNaN(id) || !name || !email || typeof age !== 'number') {
        return res.status(400).json({ error: 'Invalid input: id, name, email, and age are required' });
    }
    try {
        const result = await client.query(
            'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *', [name, email, age, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Delete user
app.delete('/users/:id', async(req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    try {
        const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
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
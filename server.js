const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (in production, use a database)
let businesses = [];
let users = [];

// Routes
app.get('/api/businesses', (req, res) => {
    res.json(businesses);
});

app.post('/api/businesses', (req, res) => {
    const business = req.body;
    business.id = Date.now().toString();
    businesses.push(business);
    res.json(business);
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const user = req.body;
    user.id = Date.now().toString();
    users.push(user);
    res.json(user);
});

app.put('/api/businesses/:id', (req, res) => {
    const id = req.params.id;
    const updatedBusiness = req.body;
    const index = businesses.findIndex(b => b.id === id);
    if (index !== -1) {
        businesses[index] = { ...businesses[index], ...updatedBusiness };
        res.json(businesses[index]);
    } else {
        res.status(404).json({ error: 'Business not found' });
    }
});

app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        res.json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const business = businesses.find(b => b.id === user.businessId);
        res.json({ user, business });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/businesses', (req, res) => {
    db.getAllBusinesses((err, businesses) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(businesses);
        }
    });
});

app.post('/api/businesses', (req, res) => {
    const { name } = req.body;
    db.createBusiness(name, (err, business) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(business);
        }
    });
});

app.get('/api/users', (req, res) => {
    db.getAllUsers((err, users) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(users);
        }
    });
});

app.post('/api/users', (req, res) => {
    const { username, password, businessId } = req.body;
    db.createUser(username, password, businessId, (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(user);
        }
    });
});

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { businessName, username, password } = req.body;
    // First create business
    db.createBusiness(businessName, (err, business) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            // Then create user linked to the business
            db.createUser(username, password, business.id, (err, user) => {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json({ message: 'Registration successful', user, business });
                }
            });
        }
    });
});

// Get business by ID
app.get('/api/businesses/:id', (req, res) => {
    const id = req.params.id;
    db.getBusinessById(id, (err, business) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (!business) {
            res.status(404).json({ error: 'Business not found' });
        } else {
            res.json(business);
        }
    });
});

app.put('/api/businesses/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    // For items, store as JSON string
    if (updates.items) {
        updates.items = JSON.stringify(updates.items);
    }
    db.updateBusiness(id, updates, (err, changes) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (changes === 0) {
            res.status(404).json({ error: 'Business not found' });
        } else {
            db.getBusinessById(id, (err, business) => {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json(business);
                }
            });
        }
    });
});

app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    db.updateUser(id, updates, (err, changes) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (changes === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            db.getUserById(id, (err, user) => {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json(user);
                }
            });
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.getUserByUsername(username, (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (!user || user.password !== password) {
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            db.getBusinessById(user.business_id, (err, business) => {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json({ userId: user.id, businessId: user.business_id, user, business });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

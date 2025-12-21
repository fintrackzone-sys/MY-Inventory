const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'stock.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            business_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES businesses (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    });

    // Create businesses table
    db.run(`
        CREATE TABLE IF NOT EXISTS businesses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            items TEXT DEFAULT '[]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating businesses table:', err.message);
        } else {
            console.log('Businesses table ready.');
        }
    });
}

// User functions
function createUser(username, password, businessId, callback) {
    const sql = 'INSERT INTO users (username, password, business_id) VALUES (?, ?, ?)';
    db.run(sql, [username, password, businessId], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: this.lastID, username, business_id: businessId });
        }
    });
}

function getUserByUsername(username, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
        callback(err, row);
    });
}

function getUserById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function updateUser(id, updates, callback) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    values.push(id);
    db.run(sql, values, function(err) {
        callback(err, this.changes);
    });
}

// Business functions
function createBusiness(name, callback) {
    const sql = 'INSERT INTO businesses (name) VALUES (?)';
    db.run(sql, [name], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: this.lastID, name, items: '[]' });
        }
    });
}

function getBusinessById(id, callback) {
    const sql = 'SELECT * FROM businesses WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (row) {
            row.items = JSON.parse(row.items || '[]');
        }
        callback(err, row);
    });
}

function updateBusiness(id, updates, callback) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE businesses SET ${setClause} WHERE id = ?`;
    values.push(id);
    db.run(sql, values, function(err) {
        callback(err, this.changes);
    });
}

function getAllBusinesses(callback) {
    const sql = 'SELECT * FROM businesses';
    db.all(sql, [], (err, rows) => {
        if (rows) {
            rows.forEach(row => {
                row.items = JSON.parse(row.items || '[]');
            });
        }
        callback(err, rows);
    });
}

function getAllUsers(callback) {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    updateUser,
    createBusiness,
    getBusinessById,
    updateBusiness,
    getAllBusinesses,
    getAllUsers,
    db
};

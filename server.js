const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
let businesses = [];
let users = [];

// Routes
app.post('/api/register', (req, res) => {
    const { businessName, username, password, passwordConfirm } = req.body;

    if (!businessName || !username || !password || !passwordConfirm) {
        return res.status(400).json({ error: 'Mohon isi semua field!' });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({ error: 'Password dan konfirmasi password tidak cocok!' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password harus minimal 8 karakter!' });
    }

    // Check if business name already exists
    const existingBusiness = businesses.find(b => b.name.toLowerCase() === businessName.toLowerCase());
    if (existingBusiness) {
        return res.status(400).json({ error: 'Nama usaha sudah ada!' });
    }

    // Check if username already exists
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ error: 'Username sudah ada!' });
    }

    // Create new business
    const newBusiness = {
        id: Date.now().toString(),
        name: businessName,
        items: []
    };

    // Create new user linked to the business
    const newUser = {
        id: (Date.now() + 1).toString(),
        username: username,
        password: password,
        businessId: newBusiness.id
    };

    businesses.push(newBusiness);
    users.push(newUser);

    res.json({ message: 'Akun berhasil dibuat. Silakan login menggunakan username dan password yang anda buat.' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const business = businesses.find(b => b.id === user.businessId);
        if (business) {
            res.json({
                userId: user.id,
                businessId: business.id,
                businessName: business.name,
                items: business.items || []
            });
        } else {
            res.status(400).json({ error: 'Business tidak ditemukan!' });
        }
    } else {
        res.status(401).json({ error: 'Username atau password salah!' });
    }
});

app.post('/api/logout', (req, res) => {
    // In a stateless API, logout is handled client-side
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/business/:businessId', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (business) {
        res.json(business);
    } else {
        res.status(404).json({ error: 'Business tidak ditemukan!' });
    }
});

app.put('/api/business/:businessId', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (business) {
        business.name = req.body.name;
        res.json(business);
    } else {
        res.status(404).json({ error: 'Business tidak ditemukan!' });
    }
});

app.put('/api/user/:userId/password', (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = users.find(u => u.id === req.params.userId);

    if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan!' });
    }

    if (currentPassword !== user.password) {
        return res.status(400).json({ error: 'Password lama salah!' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: 'Password baru dan konfirmasi password tidak cocok!' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password harus minimal 8 karakter!' });
    }

    user.password = newPassword;
    res.json({ message: 'Password berhasil diubah!' });
});

app.get('/api/business/:businessId/items', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (business) {
        res.json(business.items || []);
    } else {
        res.status(404).json({ error: 'Business tidak ditemukan!' });
    }
});

app.post('/api/business/:businessId/items', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (!business) {
        return res.status(404).json({ error: 'Business tidak ditemukan!' });
    }

    const { code, name, stock, price } = req.body;

    if (!code || !name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Mohon isi semua field dengan benar!' });
    }

    const existingItem = business.items.find(item => item.code === code);
    if (existingItem) {
        return res.status(400).json({ error: 'Kode item sudah ada!' });
    }

    const newItem = {
        id: Date.now().toString(),
        code,
        name,
        stock: parseInt(stock),
        price: parseFloat(price),
        transactions: []
    };

    business.items.push(newItem);
    res.json(newItem);
});

app.put('/api/business/:businessId/items/:itemId', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (!business) {
        return res.status(404).json({ error: 'Business tidak ditemukan!' });
    }

    const item = business.items.find(item => item.id === req.params.itemId);
    if (!item) {
        return res.status(404).json({ error: 'Item tidak ditemukan!' });
    }

    const { code, name, stock, price } = req.body;

    if (!code || !name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Mohon isi semua field dengan benar!' });
    }

    const existingItem = business.items.find(i => i.code === code && i.id !== req.params.itemId);
    if (existingItem) {
        return res.status(400).json({ error: 'Kode item sudah ada!' });
    }

    item.code = code;
    item.name = name;
    item.stock = parseInt(stock);
    item.price = parseFloat(price);

    res.json(item);
});

app.delete('/api/business/:businessId/items/:itemId', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (!business) {
        return res.status(404).json({ error: 'Business tidak ditemukan!' });
    }

    const itemIndex = business.items.findIndex(item => item.id === req.params.itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item tidak ditemukan!' });
    }

    business.items.splice(itemIndex, 1);
    res.json({ message: 'Item berhasil dihapus!' });
});

app.post('/api/business/:businessId/items/:itemId/transactions', (req, res) => {
    const business = businesses.find(b => b.id === req.params.businessId);
    if (!business) {
        return res.status(404).json({ error: 'Business tidak ditemukan!' });
    }

    const item = business.items.find(item => item.id === req.params.itemId);
    if (!item) {
        return res.status(404).json({ error: 'Item tidak ditemukan!' });
    }

    const { type, quantity, cost, date, notes } = req.body;

    if (!type || !quantity || !date) {
        return res.status(400).json({ error: 'Mohon isi semua field yang diperlukan!' });
    }

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Jumlah harus lebih dari 0!' });
    }

    if (type === 'incoming' && (!cost || cost <= 0)) {
        return res.status(400).json({ error: 'Harga per unit harus lebih dari 0 untuk barang masuk!' });
    }

    if (type === 'outgoing' && item.stock < quantity) {
        return res.status(400).json({ error: 'Stok tidak cukup!' });
    }

    const transaction = {
        id: Date.now().toString(),
        type,
        quantity: parseInt(quantity),
        cost: type === 'incoming' ? parseFloat(cost) : 0,
        date,
        notes: notes || ''
    };

    if (!item.transactions) item.transactions = [];
    item.transactions.push(transaction);

    if (type === 'incoming') {
        item.stock += parseInt(quantity);
    } else if (type === 'outgoing') {
        item.stock -= parseInt(quantity);
    }

    res.json(transaction);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

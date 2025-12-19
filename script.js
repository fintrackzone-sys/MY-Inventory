// Multi-tenant functionality
let businesses = JSON.parse(localStorage.getItem('businesses')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentBusinessId = localStorage.getItem('currentBusinessId');
let currentUserId = localStorage.getItem('currentUserId');

// Login functionality
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Registration elements
const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');
const registerError = document.getElementById('register-error');

// Hamburger menu elements
const hamburgerBtn = document.getElementById('hamburger-btn');
const hamburgerMenu = document.getElementById('hamburger-menu');
const dashboardLink = document.getElementById('dashboard-link');
const stockLink = document.getElementById('stock-link');
const stockCardLink = document.getElementById('stock-card-link');
const editBusinessLink = document.getElementById('edit-business-link');
const logoutLink = document.getElementById('logout-link');

// Business edit modal
const editBusinessModal = document.getElementById('edit-business-modal');
const editBusinessForm = document.getElementById('edit-business-form');
const changePasswordForm = document.getElementById('change-password-form');
const businessNameElement = document.getElementById('business-name');
const businessNameInput = document.getElementById('business-name-input');

// Registration modal
const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const registerBusinessNameInput = document.getElementById('register-business-name');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const registerPasswordConfirmInput = document.getElementById('register-password-confirm');

// Transaction modal
const transactionModal = document.getElementById('transaction-modal');
const transactionForm = document.getElementById('transaction-form');
const transactionItemSelect = document.getElementById('transaction-item-select');
const transactionType = document.getElementById('transaction-type');
const transactionQuantity = document.getElementById('transaction-quantity');
const transactionCost = document.getElementById('transaction-cost');
const transactionDate = document.getElementById('transaction-date');
const transactionNotes = document.getElementById('transaction-notes');
const costField = document.getElementById('cost-field');

// Camera elements
const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const savePhotoBtn = document.getElementById('save-photo-btn');

// Barcode elements
const barcodeModal = document.getElementById('barcode-modal');
const barcodeScanner = document.getElementById('barcode-scanner');

// Camera variables
let stream;
let capturedImage;

// Sections
const formSection = document.getElementById('form-section');
const listSection = document.getElementById('list-section');
const stockCardSection = document.getElementById('stock-card-section');

// Stock card elements
const stockSearchInput = document.getElementById('stock-search');
const printStockBtn = document.getElementById('print-stock-btn');
const stockCardContainer = document.getElementById('stock-card-container');

// Current business data
let currentBusiness = null;
let items = [];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Check if user is already logged in with a business
    if (localStorage.getItem('isLoggedIn') === 'true' && currentBusinessId) {
        loadCurrentBusiness();
        showApp();
    } else {
        showLogin();
    }
}



// Login form submit
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUserId = user.id;
        localStorage.setItem('currentUserId', currentUserId);
        // Load the associated business
        currentBusiness = businesses.find(b => b.id === user.businessId);
        if (currentBusiness) {
            currentBusinessId = currentBusiness.id;
            localStorage.setItem('currentBusinessId', currentBusinessId);
            localStorage.setItem('isLoggedIn', 'true');
            items = currentBusiness.items || [];
            showApp();
        } else {
            loginError.style.display = 'block';
        }
    } else {
        loginError.style.display = 'block';
    }
});



function showLogin() {
    loginSection.style.display = 'block';
    appSection.style.display = 'none';
    loginError.style.display = 'none';
}

function showApp() {
    loginSection.style.display = 'none';
    appSection.style.display = 'block';
    businessNameElement.textContent = currentBusiness.name;
    renderItems();
}

function loadCurrentBusiness() {
    currentBusiness = businesses.find(b => b.id === currentBusinessId);
    if (currentBusiness) {
        items = currentBusiness.items || [];
    }
}

function saveBusinesses() {
    localStorage.setItem('businesses', JSON.stringify(businesses));
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveCurrentBusinessData() {
    if (currentBusiness) {
        currentBusiness.items = items;
        saveBusinesses();
    }
}

// DOM elements
const itemForm = document.getElementById('item-form');
const itemTableBody = document.getElementById('item-tbody');
const itemIdInput = document.getElementById('item-id');
const itemCodeInput = document.getElementById('item-code');
const itemNameInput = document.getElementById('item-name');
const itemStockInput = document.getElementById('item-stock');
const itemPriceInput = document.getElementById('item-price');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Event listeners
itemForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', cancelEdit);

// Hamburger menu event listeners
hamburgerBtn.addEventListener('click', toggleMenu);
dashboardLink.addEventListener('click', showDashboard);
stockLink.addEventListener('click', showStock);
stockCardLink.addEventListener('click', showStockCards);
editBusinessLink.addEventListener('click', openEditBusinessModal);
logoutLink.addEventListener('click', logout);

// Business edit modal event listeners
editBusinessForm.addEventListener('submit', saveBusinessName);
changePasswordForm.addEventListener('submit', changePassword);

// Registration toggle event listeners
loginToggle.addEventListener('click', function() {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    registerError.style.display = 'none';
});

registerToggle.addEventListener('click', function() {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';
    loginError.style.display = 'none';
});

registerForm.addEventListener('submit', registerBusiness);

// Transaction modal event listeners
transactionForm.addEventListener('submit', saveTransaction);

// Close modal buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Stock card event listeners
stockSearchInput.addEventListener('input', filterStockCards);
printStockBtn.addEventListener('click', printStockCards);

// Transaction type change listener
transactionType.addEventListener('change', function() {
    if (this.value === 'incoming') {
        costField.style.display = 'block';
    } else {
        costField.style.display =  'none';
        transactionCost.value = '';
    }
});

// Camera event listeners
document.getElementById('camera-btn').addEventListener('click', openCameraModal);
captureBtn.addEventListener('click', capturePhoto);
retakeBtn.addEventListener('click', retakePhoto);
savePhotoBtn.addEventListener('click', savePhoto);

// Barcode event listeners
document.getElementById('barcode-btn').addEventListener('click', () => openBarcodeModal('item-code'));
document.getElementById('stock-barcode-btn').addEventListener('click', () => openBarcodeModal('transaction'));

// Functions
function handleFormSubmit(e) {
    e.preventDefault();

    const id = itemIdInput.value;
    const code = itemCodeInput.value.trim();
    const name = itemNameInput.value.trim();
    const stock = parseInt(itemStockInput.value);
    const price = parseFloat(itemPriceInput.value);

    // Validation
    if (!code || !name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
        alert('Mohon isi semua field dengan benar!');
        return;
    }

    // Check unique code
    const existingItem = items.find(item => item.code === code && item.id !== id);
    if (existingItem) {
        alert('Kode item sudah ada!');
        return;
    }

    if (id) {
        // Edit existing item
        const index = items.findIndex(item => item.id === id);
        items[index] = { id, code, name, stock, price };
    } else {
        // Add new item
        const newItem = {
            id: Date.now().toString(),
            code,
            name,
            stock,
            price
        };

        // Add image if captured
        if (window.capturedItemImage) {
            newItem.image = window.capturedItemImage;
            window.capturedItemImage = null; // Clear after use
        }

        items.push(newItem);
    }

    saveItems();
    renderItems();
    resetForm();
}

function renderItems() {
    itemTableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        const imageHtml = item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : 'Tidak ada foto';
        row.innerHTML = `
            <td>${imageHtml}</td>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editItem('${item.id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteItem('${item.id}')">Hapus</button>
            </td>
        `;
        itemTableBody.appendChild(row);
    });
}

function editItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        itemIdInput.value = item.id;
        itemCodeInput.value = item.code;
        itemNameInput.value = item.name;
        itemStockInput.value = item.stock;
        itemPriceInput.value = item.price;
        submitBtn.textContent = 'Update Item';
        cancelBtn.style.display = 'inline-block';
    }
}

function deleteItem(id) {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
        items = items.filter(item => item.id !== id);
        saveItems();
        renderItems();
    }
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    itemForm.reset();
    itemIdInput.value = '';
    submitBtn.textContent = 'Tambah Item';
    cancelBtn.style.display = 'none';
}

function saveItems() {
    saveCurrentBusinessData();
}

// Hamburger menu functions
function toggleMenu() {
    console.log('Toggle menu called');
    hamburgerMenu.classList.toggle('active');
}

function showDashboard() {
    formSection.style.display = 'block';
    listSection.style.display = 'block';
    stockCardSection.style.display = 'none';
    hamburgerMenu.classList.remove('active');
}

function showStock() {
    formSection.style.display = 'none';
    listSection.style.display = 'none';
    stockCardSection.style.display = 'block';

    // Clear existing content
    stockCardSection.innerHTML = '';

    // Render stock opname interface
    renderStockOpname();

    hamburgerMenu.classList.remove('active');
}

function showStockCards() {
    formSection.style.display = 'none';
    listSection.style.display = 'none';
    stockCardSection.style.display = 'block';

    // Clear existing content
    stockCardSection.innerHTML = '';

    // Add controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'stock-card-controls';
    controlsDiv.innerHTML = `
        <input type="text" id="stock-search" placeholder="Cari item...">
        <button id="stock-barcode-btn" class="action-btn" title="Scan Barcode untuk Transaksi" style="padding: 10px 15px; background: linear-gradient(135deg, #ff9800, #f57c00); color: white; border: none; border-radius: 4px; cursor: pointer;">📱 Scan Barcode</button>
    `;
    stockCardSection.appendChild(controlsDiv);

    // Add stock card container
    const containerDiv = document.createElement('div');
    containerDiv.id = 'stock-card-container';
    stockCardSection.appendChild(containerDiv);

    // Re-attach event listeners
    document.getElementById('stock-search').addEventListener('input', filterStockCards);
    document.getElementById('stock-barcode-btn').addEventListener('click', () => openBarcodeModal('transaction'));

    // Add separate transaction section
    const transactionSection = renderTransactionSection();
    stockCardSection.appendChild(transactionSection);

    // Add stock cards
    renderStockCards();

    // Render global transaction history
    renderGlobalTransactionHistory();

    hamburgerMenu.classList.remove('active');
}

// Render stock opname interface for incoming and outgoing goods
function renderStockOpname() {
    const opnameSection = document.createElement('div');
    opnameSection.className = 'stock-opname-section';
    opnameSection.innerHTML = `
        <h2>Persediaan Barang</h2>
        <button id="print-stock-btn" class="print-btn">Print Kartu Stok</button>
        <h3>Daftar Item Stok</h3>
        <div id="stock-items-list">
            <!-- Stock items list will be populated here -->
        </div>
    `;
    stockCardSection.appendChild(opnameSection);

    // Add event listener for print button
    document.getElementById('print-stock-btn').addEventListener('click', printStockCards);

    // Render stock items list
    renderStockItemsList();
}

// Render stock items list with incoming, outgoing, and final stock
function renderStockItemsList() {
    const listContainer = document.getElementById('stock-items-list');
    if (!listContainer) return;

    if (items.length === 0) {
        listContainer.innerHTML = '<p>Belum ada item yang ditambahkan.</p>';
        return;
    }

    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Kode Item</th>
                    <th>Nama Item</th>
                    <th>Persediaan Awal</th>
                    <th>Jumlah Masuk</th>
                    <th>Jumlah Keluar</th>
                    <th>Persediaan Terakhir</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    const transactions = item.transactions || [];
                    const incoming = transactions.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.quantity, 0);
                    const outgoing = transactions.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.quantity, 0);
                    const initialStock = item.stock - incoming + outgoing;
                    const finalStock = item.stock;

                    return `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.name}</td>
                            <td>${initialStock}</td>
                            <td>${incoming}</td>
                            <td>${outgoing}</td>
                            <td>${finalStock}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    listContainer.innerHTML = tableHtml;
}

// Render stock opname history
function renderStockOpnameHistory() {
    const historyContainer = document.getElementById('stock-opname-history');
    if (!historyContainer) return;

    // Collect all transactions from all items
    let allTransactions = [];
    items.forEach(item => {
        if (item.transactions) {
            item.transactions.forEach(transaction => {
                allTransactions.push({
                    ...transaction,
                    itemName: item.name,
                    itemCode: item.code
                });
            });
        }
    });

    // Sort transactions by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allTransactions.length === 0) {
        historyContainer.innerHTML = '<p>Belum ada transaksi stok.</p>';
        return;
    }

    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Item</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Harga</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                ${allTransactions.map(t => `
                    <tr>
                        <td>${new Date(t.date).toLocaleDateString('id-ID')}</td>
                        <td>${t.itemName} (${t.itemCode})</td>
                        <td>${t.type === 'incoming' ? 'Masuk' : 'Keluar'}</td>
                        <td>${t.quantity}</td>
                        <td>${t.cost ? 'Rp ' + t.cost.toLocaleString() : '-'}</td>
                        <td>${t.notes || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    historyContainer.innerHTML = tableHtml;
}

// Render separate transaction section
function renderTransactionSection() {
    const transactionSection = document.createElement('div');
    transactionSection.className = 'transaction-section';
    transactionSection.innerHTML = `
        <h2>Tambah Transaksi</h2>
        <form onsubmit="event.preventDefault(); openTransactionModal()">
            <button type="submit">Tambah Transaksi Baru</button>
        </form>
        <h2>Riwayat Transaksi</h2>
        <div id="global-transaction-history">
            <!-- Global transaction history will be populated here -->
        </div>
    `;
    return transactionSection;
}

// Render global transaction history
function renderGlobalTransactionHistory() {
    const historyContainer = document.getElementById('global-transaction-history');
    if (!historyContainer) return;

    // Collect all transactions from all items
    let allTransactions = [];
    items.forEach(item => {
        if (item.transactions) {
            item.transactions.forEach(transaction => {
                allTransactions.push({
                    ...transaction,
                    itemName: item.name,
                    itemCode: item.code
                });
            });
        }
    });

    // Sort transactions by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allTransactions.length === 0) {
        historyContainer.innerHTML = '<p>Belum ada transaksi.</p>';
        return;
    }

    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Item</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Harga</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                ${allTransactions.map(t => `
                    <tr>
                        <td>${new Date(t.date).toLocaleDateString('id-ID')}</td>
                        <td>${t.itemName} (${t.itemCode})</td>
                        <td>${t.type === 'incoming' ? 'Masuk' : 'Keluar'}</td>
                        <td>${t.quantity}</td>
                        <td>${t.cost ? 'Rp ' + t.cost.toLocaleString() : '-'}</td>
                        <td>${t.notes || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    historyContainer.innerHTML = tableHtml;
}



function filterStockCards() {
    const searchTerm = stockSearchInput.value.toLowerCase();
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm)
    );
    renderStockCards(filteredItems);
}

function printStockCards() {
    // Create print content for stock opname report
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('id-ID');

    let printContent = `
        <html>
        <head>
            <title>Laporan Persediaan Barang</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; margin-bottom: 10px; }
                .header { text-align: center; margin-bottom: 30px; }
                .business-name { font-size: 18px; font-weight: bold; }
                .date { font-size: 14px; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .total-row { font-weight: bold; background-color: #e9e9e9; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="business-name">${currentBusiness ? currentBusiness.name : 'Nama Usaha'}</div>
                <div class="date">Tanggal: ${currentDate}</div>
                <h1>Persediaan Barang</h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kode Item</th>
                        <th>Nama Item</th>
                        <th>Persediaan Awal</th>
                        <th>Jumlah Masuk</th>
                        <th>Jumlah Keluar</th>
                        <th>Persediaan Terakhir</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let totalInitial = 0;
    let totalIncoming = 0;
    let totalOutgoing = 0;
    let totalFinal = 0;

    items.forEach((item, index) => {
        const transactions = item.transactions || [];
        const incoming = transactions.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.quantity, 0);
        const outgoing = transactions.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.quantity, 0);
        const initialStock = item.stock - incoming + outgoing;
        const finalStock = item.stock;

        totalInitial += initialStock;
        totalIncoming += incoming;
        totalOutgoing += outgoing;
        totalFinal += finalStock;

        printContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${initialStock}</td>
                <td>${incoming}</td>
                <td>${outgoing}</td>
                <td>${finalStock}</td>
            </tr>
        `;
    });

    // Add total row
    printContent += `
            <tr class="total-row">
                <td colspan="3"><strong>TOTAL</strong></td>
                <td><strong>${totalInitial}</strong></td>
                <td><strong>${totalIncoming}</strong></td>
                <td><strong>${totalOutgoing}</strong></td>
                <td><strong>${totalFinal}</strong></td>
            </tr>
        </tbody>
    </table>
    <div style="margin-top: 30px; text-align: center; font-size: 12px;">
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
    </div>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Business edit functions
function openEditBusinessModal() {
    if (currentBusiness) {
        businessNameInput.value = currentBusiness.name;
        editBusinessModal.style.display = 'block';
        hamburgerMenu.classList.remove('active');
    }
}

function saveBusinessName(e) {
    e.preventDefault();
    const newName = businessNameInput.value.trim();
    if (newName && currentBusiness) {
        currentBusiness.name = newName;
        businessNameElement.textContent = newName;
        saveBusinesses();
        editBusinessModal.style.display = 'none';
    }
}

function changePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Mohon isi semua field!');
        return;
    }

    // Find current user
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) {
        alert('User tidak ditemukan!');
        return;
    }

    // Verify current password
    if (currentPassword !== currentUser.password) {
        alert('Password lama salah!');
        return;
    }

    // Check if new password matches confirmation
    if (newPassword !== confirmNewPassword) {
        alert('Password baru dan konfirmasi password tidak cocok!');
        return;
    }

    // Update password
    currentUser.password = newPassword;
    saveUsers();

    // Clear form and close modal
    changePasswordForm.reset();
    editBusinessModal.style.display = 'none';

    alert('Password berhasil diubah!');
}



// Registration functions
function openRegisterModal() {
    registerModal.style.display = 'block';
}

function registerBusiness(e) {
    e.preventDefault();
    const businessName = registerBusinessNameInput.value.trim();
    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const passwordConfirm = registerPasswordConfirmInput.value.trim();

    if (!businessName || !username || !password || !passwordConfirm) {
        alert('Mohon isi semua field!');
        return;
    }

    // validasi konfirmasi password
    if (password !== passwordConfirm) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
    }

    // Check if business name already exists
    const existingBusiness = businesses.find(b => b.name.toLowerCase() === businessName.toLowerCase());
    if (existingBusiness) {
        alert('Nama usaha sudah ada!');
        return;
    }

    // Check if username already exists
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        alert('Username sudah ada!');
        return;
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
    saveBusinesses();
    saveUsers();

    // Reset form and close register panel
    registerForm.reset();
    if (registerModal) registerModal.style.display = 'none';

    // Prefill login form so the newly registered user can immediately login
    document.getElementById('username').value = username;
    document.getElementById('password').value = '';

    // Switch UI to login view
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';

    alert('Akun berhasil dibuat. Silakan login menggunakan username dan password yang anda buat.');
}

// Logout from hamburger
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentBusinessId');
    currentUserId = null;
    currentBusinessId = null;
    currentBusiness = null;
    items = [];
    hamburgerMenu.classList.remove('active');
    showLogin();
}

// Transaction functions
function openTransactionModal(itemId = null, type = 'incoming') {
    // Populate item select dropdown
    transactionItemSelect.innerHTML = '<option value="">Pilih Item</option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.code})`;
        if (itemId && item.id === itemId) {
            option.selected = true;
        }
        transactionItemSelect.appendChild(option);
    });

    // Add button next to item select (available for both incoming and outgoing)
    let addItemBtn = document.getElementById('add-item-from-transaction-btn');
    if (!addItemBtn) {
        addItemBtn = document.createElement('button');
        addItemBtn.id = 'add-item-from-transaction-btn';
        addItemBtn.type = 'button';
        addItemBtn.textContent = 'Tambah Item Baru';
        addItemBtn.style.marginLeft = '10px';
        addItemBtn.onclick = function() {
            transactionModal.style.display = 'none';
            showDashboard();
            document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
        };
        transactionItemSelect.parentNode.insertBefore(addItemBtn, transactionItemSelect.nextSibling);
    }

    transactionType.value = type;
    transactionDate.value = new Date().toISOString().split('T')[0];
    // Show cost field if incoming
    if (type === 'incoming') {
        costField.style.display = 'block';
    } else {
        costField.style.display = 'none';
        transactionCost.value = '';
    }
    transactionModal.style.display = 'block';
}

function autoSaveTransaction(itemId, type, quantity, cost, date, notes) {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    // Initialize transactions array if not exists
    if (!item.transactions) item.transactions = [];

    // Add transaction
    const transaction = {
        id: Date.now().toString(),
        type,
        quantity,
        cost: type === 'incoming' ? cost : 0,
        date,
        notes
    };
    item.transactions.push(transaction);

    // Update stock based on transaction
    if (type === 'incoming') {
        item.stock += quantity;
        // Calculate new average cost
        calculateAverageCost(item);
    } else if (type === 'outgoing') {
        if (item.stock >= quantity) {
            item.stock -= quantity;
        } else {
            alert('Stok tidak cukup!');
            return;
        }
    }

    saveItems();
    renderItems();
    renderGlobalTransactionHistory();
    // Re-render stock cards if in stock card section
    if (stockCardSection.style.display !== 'none') {
        renderStockCards();
    }
}

function saveTransaction(e) {
    e.preventDefault();
    const itemId = transactionItemSelect.value;
    const type = transactionType.value;
    const quantity = parseInt(transactionQuantity.value);
    const cost = parseFloat(transactionCost.value) || 0;
    const date = transactionDate.value;
    const notes = transactionNotes.value.trim();

    if (!itemId) {
        alert('Pilih item terlebih dahulu!');
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert('Jumlah harus lebih dari 0!');
        return;
    }

    if (type === 'incoming' && cost <= 0) {
        alert('Harga per unit harus lebih dari 0 untuk barang masuk!');
        return;
    }

    const item = items.find(item => item.id === itemId);
    if (!item) return;

    // Initialize transactions array if not exists
    if (!item.transactions) item.transactions = [];

    // Add transaction
    const transaction = {
        id: Date.now().toString(),
        type,
        quantity,
        cost: type === 'incoming' ? cost : 0,
        date,
        notes
    };
    item.transactions.push(transaction);

    // Update stock based on transaction
    if (type === 'incoming') {
        item.stock += quantity;
        // Calculate new average cost
        calculateAverageCost(item);
    } else if (type === 'outgoing') {
        if (item.stock >= quantity) {
            item.stock -= quantity;
        } else {
            alert('Stok tidak cukup!');
            return;
        }
    }

    saveItems();
    renderItems();
    renderGlobalTransactionHistory();
    transactionModal.style.display = 'none';
    transactionForm.reset();
    costField.style.display = 'none';
}

// Calculate average cost using weighted average method
function calculateAverageCost(item) {
    const incomingTransactions = item.transactions.filter(t => t.type === 'incoming' && t.cost > 0);

    if (incomingTransactions.length === 0) return;

    let totalCost = 0;
    let totalQuantity = 0;

    incomingTransactions.forEach(transaction => {
        totalCost += transaction.cost * transaction.quantity;
        totalQuantity += transaction.quantity;
    });

    if (totalQuantity > 0) {
        item.averageCost = totalCost / totalQuantity;
        item.price = item.averageCost; // Update the display price to average cost
    }
}

// Update stock card rendering to calculate from transactions
function renderStockCards(filteredItems = items) {
    stockCardContainer.innerHTML = '';

    filteredItems.forEach(item => {
        const transactions = item.transactions || [];
        const incoming = transactions.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.quantity, 0);
        const outgoing = transactions.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.quantity, 0);
        const initialStock = item.stock - incoming + outgoing; // Calculate initial stock

        const stockCard = document.createElement('div');
        stockCard.className = 'stock-card';
        stockCard.innerHTML = `
            <h3>${item.name} (${item.code})</h3>
            <div class="stock-card-info">
                <div>
                    <label>Stok Awal</label>
                    <span>${initialStock}</span>
                </div>
                <div>
                    <label>Masuk</label>
                    <span>${incoming}</span>
                </div>
                <div>
                    <label>Keluar</label>
                    <span>${outgoing}</span>
                </div>
                <div>
                    <label>Stok Akhir</label>
                    <span>${item.stock}</span>
                </div>
            </div>
            <div class="transaction-history">
                <h3>Riwayat Transaksi</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Tipe</th>
                            <th>Jumlah</th>
                            <th>Harga</th>
                            <th>Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.map(t => `
                            <tr>
                                <td>${new Date(t.date).toLocaleDateString('id-ID')}</td>
                                <td>${t.type === 'incoming' ? 'Masuk' : 'Keluar'}</td>
                                <td>${t.quantity}</td>
                                <td>${t.cost ? 'Rp ' + t.cost.toLocaleString() : '-'}</td>
                                <td>${t.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        stockCardContainer.appendChild(stockCard);
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === editBusinessModal) {
        editBusinessModal.style.display = 'none';
    }
    if (event.target === transactionModal) {
        transactionModal.style.display = 'none';
    }
    if (event.target === addBusinessModal) {
        addBusinessModal.style.display = 'none';
    }
}

// Camera functions
async function openCameraModal() {
    cameraModal.style.display = 'block';
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        cameraVideo.srcObject = stream;
    } catch (error) {
        alert('Tidak dapat mengakses kamera: ' + error.message);
        cameraModal.style.display = 'none';
    }
}

function capturePhoto() {
    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    context.drawImage(cameraVideo, 0, 0);
    capturedImage = cameraCanvas.toDataURL('image/jpeg', 0.8);

    cameraVideo.style.display = 'none';
    cameraCanvas.style.display = 'block';
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    savePhotoBtn.style.display = 'inline-block';
}

function retakePhoto() {
    cameraVideo.style.display = 'block';
    cameraCanvas.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    savePhotoBtn.style.display = 'none';
    capturedImage = null;
}

function savePhoto() {
    // Store the captured image in a global variable for the form
    window.capturedItemImage = capturedImage;
    cameraModal.style.display = 'none';
    stopCamera();
    alert('Foto berhasil disimpan! Klik "Tambah Item" untuk menyimpan item dengan foto.');
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraVideo.style.display = 'block';
    cameraCanvas.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    savePhotoBtn.style.display = 'none';
    capturedImage = null;
}

// Barcode functions
let barcodeContext = 'item-code'; // Default context

function openBarcodeModal(context = 'item-code') {
    barcodeContext = context;
    barcodeModal.style.display = 'block';
    startBarcodeScanner();
}

function startBarcodeScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: barcodeScanner,
            constraints: {
                video: true
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "upc_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            alert('Gagal memulai scanner barcode: ' + err.message);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        stopBarcodeScanner();
        barcodeModal.style.display = 'none';

        if (barcodeContext === 'item-code') {
            document.getElementById('item-code').value = code;
            alert('Barcode berhasil dipindai: ' + code);
        } else if (barcodeContext === 'transaction') {
            const item = items.find(item => item.code === code);
            if (item) {
                // Automatically create an outgoing transaction with quantity 1
                autoSaveTransaction(item.id, 'outgoing', 1, 0, new Date().toISOString().split('T')[0], 'Auto transaction from barcode scan');
                alert('Transaksi otomatis berhasil dibuat untuk item: ' + item.name + ' (Jumlah: 1)');
            } else {
                alert('Item dengan kode barcode ' + code + ' tidak ditemukan!');
            }
        }
    });
}

function stopBarcodeScanner() {
    Quagga.stop();
}

// Initial render
renderItems();

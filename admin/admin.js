// admin.js - Admin Dashboard Logic

const API_BASE = 'http://localhost:5000/api';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check which page we're on
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        await checkAuth();
        setupDashboard();
        loadDashboardStats();
        loadRecentOrders();
    } else {
        setupLoginPage();
    }
});

// Login page setup
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = 'Invalid username or password';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            errorDiv.textContent = 'Cannot connect to server. Make sure backend is running.';
            errorDiv.style.display = 'block';
        }
    });
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/admin/check-auth`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            window.location.href = 'index.html';
        } else {
            document.getElementById('username').textContent = data.username;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'index.html';
    }
}

// Dashboard setup
function setupDashboard() {
    // Navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE}/admin/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'index.html';
    });
    
    // Search
    document.getElementById('searchInput')?.addEventListener('input', debounce(() => {
        loadOrders(1);
    }, 500));
    
    // Close modal
    document.querySelector('.close')?.addEventListener('click', () => {
        document.getElementById('orderModal').style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('orderModal')) {
            document.getElementById('orderModal').style.display = 'none';
        }
    });
}

// Show page
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    document.getElementById('pageTitle').textContent = 
        page.charAt(0).toUpperCase() + page.slice(1);
    
    if (page === 'orders') {
        loadOrders(1);
    }
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalOrders').textContent = data.stats.totalOrders;
            document.getElementById('totalRevenue').textContent = 
                `KSh ${data.stats.totalRevenue.toLocaleString()}`;
            document.getElementById('pendingOrders').textContent = data.stats.pendingOrders;
            document.getElementById('recentOrders').textContent = data.stats.recentOrders;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const response = await fetch(`${API_BASE}/admin/orders?limit=5`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            renderRecentOrders(data.orders);
        }
    } catch (error) {
        console.error('Failed to load recent orders:', error);
    }
}

// Render recent orders
function renderRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.created_at).toLocaleDateString();
        const statusClass = order.payment_status === 'pending' ? 'status-pending' : 'status-paid';
        
        return `
            <tr>
                <td>${order.order_number}</td>
                <td>${order.customer_first_name} ${order.customer_last_name}</td>
                <td>${date}</td>
                <td>KSh ${order.total.toLocaleString()}</td>
                <td><span class="status-badge ${statusClass}">${order.payment_status}</span></td>
                <td><button class="view-btn" onclick="viewOrder('${order.order_number}')">View</button></td>
            </tr>
        `;
    }).join('');
}

// Load all orders
async function loadOrders(page) {
    try {
        const search = document.getElementById('searchInput')?.value || '';
        const url = `${API_BASE}/admin/orders?page=${page}&limit=20&search=${encodeURIComponent(search)}`;
        
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        
        if (data.success) {
            renderOrders(data.orders);
            renderPagination(data.pagination);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

// Render orders table
function renderOrders(orders) {
    const tbody = document.getElementById('ordersBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.created_at).toLocaleDateString();
        const statusClass = order.payment_status === 'pending' ? 'status-pending' : 'status-paid';
        
        return `
            <tr>
                <td>${order.order_number}</td>
                <td>${order.customer_first_name} ${order.customer_last_name}</td>
                <td>${order.customer_email}</td>
                <td>${date}</td>
                <td>KSh ${order.total.toLocaleString()}</td>
                <td><span class="status-badge ${statusClass}">${order.payment_status}</span></td>
                <td><button class="view-btn" onclick="viewOrder('${order.order_number}')">View</button></td>
            </tr>
        `;
    }).join('');
}

// Render pagination
function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    let html = '';
    for (let i = 1; i <= pagination.pages; i++) {
        html += `<button class="${i === pagination.page ? 'active' : ''}" onclick="loadOrders(${i})">${i}</button>`;
    }
    
    container.innerHTML = html;
}

// View order details
async function viewOrder(orderNumber) {
    try {
        const response = await fetch(`${API_BASE}/admin/orders/${orderNumber}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showOrderDetails(data.order);
        }
    } catch (error) {
        console.error('Failed to load order details:', error);
    }
}

// Show order details modal
function showOrderDetails(order) {
    const modal = document.getElementById('orderModal');
    const details = document.getElementById('orderDetails');
    
    const date = new Date(order.created_at).toLocaleString();
    
    let itemsHtml = '';
    if (order.items) {
        const items = JSON.parse(order.items);
        itemsHtml = `
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>KSh ${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>KSh ${item.subtotal}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    details.innerHTML = `
        <div class="order-detail-card">
            <div class="detail-section">
                <h3>Order Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Order Number:</span>
                    <span class="detail-value">${order.order_number}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${order.payment_status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">KSh ${order.total}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Customer Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${order.customer_first_name} ${order.customer_last_name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${order.customer_email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${order.customer_phone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">${order.customer_address}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">City:</span>
                    <span class="detail-value">${order.customer_city}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Items</h3>
                ${itemsHtml}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make viewOrder available globally
window.viewOrder = viewOrder;
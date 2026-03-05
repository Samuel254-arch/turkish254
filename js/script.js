// PRODUCT DATABASE
const products = {
    shirts: [
        { id: 1, name: "Turkish Shirt", price: 2000, image: "assets/images/shirts/Turkish Shirt 1.png", category: "shirts" },
        { id: 2, name: "Turkish Shirt", price: 2000, image: "assets/images/shirts/Turkish Shirt 2.png", category: "shirts" },
        { id: 3, name: "Turkish Shirt", price: 2000, image: "assets/images/shirts/Turkish Shirt 3.png", category: "shirts" },
        { id: 4, name: "Turkish Shirt", price: 2000, image: "assets/images/shirts/Turkish Shirt 4.png", category: "shirts" }
    ],
    sneakers: [
        { id: 5, name: "Turkish Sneakers", price: 2500, image: "assets/images/sneakers/sneaker 1.png", category: "sneakers" },
        { id: 6, name: "Turkish Sneakers", price: 2500, image: "assets/images/sneakers/sneaker 2.png", category: "sneakers" },
        { id: 7, name: "Turkish Sneakers", price: 2500, image: "assets/images/sneakers/sneaker 3.png", category: "sneakers" },
        { id: 8, name: "Turkish Sneakers", price: 2500, image: "assets/images/sneakers/sneaker 4.png", category: "sneakers" }
    ],
    "formal-shoes": [
        { id: 9, name: "Office Shoes", price: 4500, image: "assets/images/formal-shoes/office shoes 1.png", category: "formal-shoes" },
        { id: 10, name: "Office Shoes", price: 4500, image: "assets/images/formal-shoes/office shoes 2.png", category: "formal-shoes" },
        { id: 11, name: "Office Shoes", price: 4500, image: "assets/images/formal-shoes/office shoes 3.png", category: "formal-shoes" },
        { id: 12, name: "Office Shoes", price: 4500, image: "assets/images/formal-shoes/office shoes 4.png", category: "formal-shoes" }
    ],
    "open-shoes": [
        { id: 13, name: "Open Shoes", price: 2000, image: "assets/images/open-shoes/open-shoes 1.png", category: "open-shoes" },
        { id: 14, name: "Open Shoes", price: 2000, image: "assets/images/open-shoes/open-shoes 2.png", category: "open-shoes" },
        { id: 15, name: "Open Shoes", price: 2000, image: "assets/images/open-shoes/open-shoes 3.png", category: "open-shoes" },
        { id: 16, name: "Open Shoes", price: 2000, image: "assets/images/open-shoes/open-shoes 4.png", category: "open-shoes" }
    ],
    jackets: [
        { id: 17, name: "Unique Jacket", price: 4000, image: "assets/images/jackets/unique jackets 1.png", category: "jackets" },
        { id: 18, name: "Unique Jacket", price: 4000, image: "assets/images/jackets/unique jackets 2.png", category: "jackets" },
        { id: 19, name: "Unique Jacket", price: 4000, image: "assets/images/jackets/unique jackets 3.png", category: "jackets" },
        { id: 20, name: "Unique Jacket", price: 4000, image: "assets/images/jackets/unique jackets 4.png", category: "jackets" }
    ],
    khakis: [
        { id: 21, name: "Turkish Khakis", price: 2500, image: "assets/images/khakis/khakis 1.png", category: "khakis" },
        { id: 22, name: "Turkish Khakis", price: 2500, image: "assets/images/khakis/khakis 2.png", category: "khakis" },
        { id: 23, name: "Turkish Khakis", price: 2500, image: "assets/images/khakis/khakis 3.png", category: "khakis" },
        { id: 24, name: "Turkish Khakis", price: 2500, image: "assets/images/khakis/khakis 4.png", category: "khakis" }
    ],
    tracksuits: [
        { id: 25, name: "Turkish Tracksuit", price: 3500, image: "assets/images/tracksuits/Turkish Tracksuit 1.png", category: "tracksuits" },
        { id: 26, name: "Turkish Tracksuit", price: 3500, image: "assets/images/tracksuits/Turkish Tracksuit 2.png", category: "tracksuits" },
        { id: 27, name: "Turkish Tracksuit", price: 3500, image: "assets/images/tracksuits/Turkish Tracksuit 3.png", category: "tracksuits" },
        { id: 28, name: "Turkish Tracksuit", price: 3500, image: "assets/images/tracksuits/Turkish Tracksuit 4.png", category: "tracksuits" }
    ]
};

// ===========================================
// GLOBAL VARIABLES
// ===========================================
let cart = [];
let pendingProduct = null;
let pendingQuantity = 1;
let lastOrderTotal = 0;
let lastOrderNumber = '';

// ===========================================
// TOAST NOTIFICATION SYSTEM
// ===========================================
function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    let icon = '';
    let toastTitle = title;
    
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle toast-icon success"></i>';
            toastTitle = toastTitle || 'Success';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle toast-icon error"></i>';
            toastTitle = toastTitle || 'Error';
            break;
        default:
            icon = '<i class="fas fa-info-circle toast-icon info"></i>';
            toastTitle = toastTitle || 'Info';
    }
    
    toast.innerHTML = `
        ${icon}
        <div class="toast-content">
            <div class="toast-title">${toastTitle}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
    
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
}

// ===========================================
// DOM CONTENT LOADED
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Turkish254 loaded');

    // Get DOM elements
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const collectionsLink = document.getElementById('collectionsLink');
    const collectionsSubmenu = document.getElementById('collectionsSubmenu');
    const cartBtn = document.getElementById('cartBtn');
    const cartSection = document.getElementById('cartSection');
    const checkoutSection = document.getElementById('checkoutSection');
    const confirmationSection = document.getElementById('confirmationSection');
    const featuredSection = document.getElementById('featuredSection');
    const categoryProducts = document.getElementById('categoryProducts');
    const contactSection = document.getElementById('contactSection');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const confirmModal = document.getElementById('confirmModal');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const closeConfirm = document.querySelector('.close-confirm');

    // ===========================================
    // SIDEBAR FUNCTIONS
    // ===========================================
    function openSidebar() {
        sidebarMenu.classList.add('active');
        overlay.classList.add('active');
    }

    function closeSidebarFunc() {
        sidebarMenu.classList.remove('active');
        overlay.classList.remove('active');
        if (collectionsSubmenu) collectionsSubmenu.classList.remove('active');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    if (collectionsLink) {
        collectionsLink.addEventListener('click', (e) => {
            e.preventDefault();
            collectionsSubmenu.classList.toggle('active');
        });
    }

    // ===========================================
    // LOAD FEATURED PRODUCTS
    // ===========================================
    function loadFeaturedVertical() {
        const container = document.getElementById('featuredVerticalContainer');
        if (!container) return;
        
        container.innerHTML = '';
        const featured = [
            products.shirts[0], products.sneakers[0], products["formal-shoes"][0],
            products["open-shoes"][0], products.jackets[0], products.khakis[0], products.tracksuits[0]
        ];
        
        featured.forEach(product => {
            if (product) {
                const div = document.createElement('div');
                div.className = 'featured-vertical-item';
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="zoomable-img">
                    <div class="featured-vertical-info">
                        <h3>${product.name}</h3>
                        <p class="featured-vertical-price">KSh ${product.price.toLocaleString()}</p>
                        <button class="featured-view-btn" data-category="${product.category}">View Collection</button>
                    </div>
                `;
                div.querySelector('.zoomable-img').addEventListener('click', () => {
                    modalImage.src = product.image;
                    imageModal.style.display = 'block';
                });
                div.querySelector('.featured-view-btn').addEventListener('click', () => showCategory(product.category));
                container.appendChild(div);
            }
        });
    }
    loadFeaturedVertical();

    // ===========================================
    // IMAGE MODAL
    // ===========================================
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            imageModal.style.display = 'none';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === imageModal) imageModal.style.display = 'none';
    });

    // ===========================================
    // SHOW CATEGORY PRODUCTS
    // ===========================================
    window.showCategory = function(category) {
        featuredSection.style.display = 'none';
        categoryProducts.style.display = 'block';
        contactSection.style.display = 'none';
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'none';
        confirmationSection.style.display = 'none';
        
        document.getElementById('categoryTitle').textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        
        const container = document.getElementById('verticalProducts');
        container.innerHTML = '';
        
        if (products[category]) {
            products[category].forEach(product => {
                const div = document.createElement('div');
                div.className = 'vertical-product-card';
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="zoomable-img">
                    <div class="vertical-product-info">
                        <h3>${product.name}</h3>
                        <p class="vertical-price">KSh ${product.price.toLocaleString()}</p>
                        <div class="quantity-controls">
                            <button class="qty-btn minus">-</button>
                            <input type="number" class="qty-input" value="1" min="1" max="10">
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                
                div.querySelector('.zoomable-img').addEventListener('click', () => {
                    modalImage.src = product.image;
                    imageModal.style.display = 'block';
                });
                
                const minus = div.querySelector('.minus');
                const plus = div.querySelector('.plus');
                const qtyInput = div.querySelector('.qty-input');
                
                minus.addEventListener('click', () => {
                    let val = parseInt(qtyInput.value);
                    if (val > 1) qtyInput.value = val - 1;
                });
                
                plus.addEventListener('click', () => {
                    let val = parseInt(qtyInput.value);
                    if (val < 10) qtyInput.value = val + 1;
                });
                
                div.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    pendingProduct = product;
                    pendingQuantity = parseInt(qtyInput.value);
                    confirmModal.style.display = 'flex';
                });
                
                container.appendChild(div);
            });
        }
        closeSidebarFunc();
    };

    // ===========================================
    // CONFIRM MODAL (ADD TO CART)
    // ===========================================
    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            if (pendingProduct) {
                const existing = cart.find(item => item.id === pendingProduct.id);
                if (existing) {
                    existing.quantity += pendingQuantity;
                } else {
                    cart.push({ ...pendingProduct, quantity: pendingQuantity });
                }
                updateCartCount();
                showToast(`${pendingQuantity} x ${pendingProduct.name} added to cart!`, 'success', 'Added to Cart');
            }
            confirmModal.style.display = 'none';
        });
    }
    
    if (confirmNo) confirmNo.addEventListener('click', () => confirmModal.style.display = 'none');
    if (closeConfirm) closeConfirm.addEventListener('click', () => confirmModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) confirmModal.style.display = 'none';
    });

    // ===========================================
    // CART FUNCTIONS
    // ===========================================
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    function displayCart() {
        const container = document.getElementById('cartItems');
        container.innerHTML = '';
        
        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            updateCartTotals();
            return;
        }
        
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">KSh ${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = cart.find(i => i.id === id);
                if (item && item.quantity > 1) item.quantity--;
                displayCart();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = cart.find(i => i.id === id);
                if (item) item.quantity++;
                displayCart();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                cart = cart.filter(item => item.id !== id);
                displayCart();
                updateCartCount();
                showToast('Item removed from cart', 'info', 'Cart Updated');
            });
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartSubtotal').textContent = `KSh ${subtotal.toLocaleString()}.00`;
        document.getElementById('cartTotal').textContent = `KSh ${subtotal.toLocaleString()}.00`;
        updateOrderSummary();
    }

    function updateOrderSummary() {
        const tbody = document.getElementById('orderItems');
        tbody.innerHTML = '';
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            tbody.innerHTML += `<tr><td>${item.name} × ${item.quantity}</td><td>KSh ${subtotal.toLocaleString()}.00</td></tr>`;
        });
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('orderSubtotal').textContent = `KSh ${subtotal.toLocaleString()}.00`;
        document.getElementById('orderTotal').textContent = `KSh ${subtotal.toLocaleString()}.00`;
    }

    // ===========================================
    // CART BUTTON
    // ===========================================
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            featuredSection.style.display = 'none';
            categoryProducts.style.display = 'none';
            contactSection.style.display = 'none';
            cartSection.style.display = 'block';
            checkoutSection.style.display = 'none';
            confirmationSection.style.display = 'none';
            displayCart();
            closeSidebarFunc();
        });
    }

    // ===========================================
    // BACK BUTTONS
    // ===========================================
    document.getElementById('backToHome')?.addEventListener('click', () => {
        featuredSection.style.display = 'block';
        categoryProducts.style.display = 'none';
        contactSection.style.display = 'none';
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'none';
        confirmationSection.style.display = 'none';
    });

    document.getElementById('backFromCart')?.addEventListener('click', () => {
        cartSection.style.display = 'none';
        featuredSection.style.display = 'block';
    });

    document.getElementById('backToCart')?.addEventListener('click', () => {
        checkoutSection.style.display = 'none';
        cartSection.style.display = 'block';
    });

    document.getElementById('backFromContact')?.addEventListener('click', () => {
        contactSection.style.display = 'none';
        featuredSection.style.display = 'block';
    });

    // ===========================================
    // UPDATE CART BUTTON
    // ===========================================
    document.getElementById('updateCartBtn')?.addEventListener('click', displayCart);

    // ===========================================
    // CHECKOUT BUTTON
    // ===========================================
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error', 'Empty Cart');
            return;
        }
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'block';
        updateOrderSummary();
    });

    // ===========================================
    // ✅ PLACE ORDER - FIXED & WORKING
    // ===========================================
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                const orderData = {
                    customer: {
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('streetAddress').value,
                        city: document.getElementById('city').value
                    },
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    totals: {
                        subtotal: totalAmount,
                        total: totalAmount
                    }
                };

                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    lastOrderTotal = totalAmount;
                    lastOrderNumber = result.order.orderNumber;

                    document.getElementById('orderNumber').textContent = lastOrderNumber;
                    document.getElementById('orderDate').textContent = new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                    });
                    document.getElementById('orderAmount').textContent = `KSh ${lastOrderTotal.toLocaleString()}.00`;

                    checkoutSection.style.display = 'none';
                    confirmationSection.style.display = 'block';

                    showToast('Order placed! Click PAY to continue.', 'success', 'Order Created');
                } else {
                    showToast('Error: ' + result.error, 'error', 'Order Failed');
                }
            } catch (error) {
                showToast('Cannot connect to server. Make sure backend is running on port 5000.', 'error', 'Connection Error');
            }
        });
    }

    // ===========================================
    // PAY BUTTON
    // ===========================================
    document.getElementById('payBtn')?.addEventListener('click', () => {
        showToast('Check your phone to enter M-PESA PIN', 'info', 'M-PESA');
    });

    // ===========================================
    // COMPLETE ORDER BUTTON
    // ===========================================
    document.getElementById('completeOrderBtn')?.addEventListener('click', () => {
        cart = [];
        updateCartCount();
        showToast('Order completed! Thank you for shopping with Turkish254.', 'success', 'Order Complete');
        confirmationSection.style.display = 'none';
        featuredSection.style.display = 'block';
    });

    document.getElementById('backFromConfirmation')?.addEventListener('click', () => {
        confirmationSection.style.display = 'none';
        featuredSection.style.display = 'block';
    });

    // ===========================================
    // NAVIGATION
    // ===========================================
    document.querySelectorAll('.menu-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page === 'home') {
                featuredSection.style.display = 'block';
                categoryProducts.style.display = 'none';
                contactSection.style.display = 'none';
                cartSection.style.display = 'none';
                checkoutSection.style.display = 'none';
                confirmationSection.style.display = 'none';
            } else if (page === 'contact') {
                featuredSection.style.display = 'none';
                categoryProducts.style.display = 'none';
                cartSection.style.display = 'none';
                checkoutSection.style.display = 'none';
                confirmationSection.style.display = 'none';
                contactSection.style.display = 'block';
            }
            closeSidebarFunc();
        });
    });

    // ===========================================
    // FOOTER NAVIGATION
    // ===========================================
    document.querySelector('.footer-home')?.addEventListener('click', (e) => {
        e.preventDefault();
        featuredSection.style.display = 'block';
        categoryProducts.style.display = 'none';
        contactSection.style.display = 'none';
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'none';
        confirmationSection.style.display = 'none';
    });

    document.querySelector('.footer-collections')?.addEventListener('click', (e) => {
        e.preventDefault();
        openSidebar();
        if (collectionsSubmenu) collectionsSubmenu.classList.add('active');
    });

    document.querySelector('.footer-contact')?.addEventListener('click', (e) => {
        e.preventDefault();
        featuredSection.style.display = 'none';
        categoryProducts.style.display = 'none';
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'none';
        confirmationSection.style.display = 'none';
        contactSection.style.display = 'block';
    });

    // ===========================================
    // CONTACT FORM
    // ===========================================
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for your message! We will get back to you soon.', 'success', 'Message Sent');
        e.target.reset();
    });

    // ===========================================
    // CATEGORY LINKS
    // ===========================================
    document.querySelectorAll('.collections-submenu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showCategory(link.dataset.category);
        });
    });

    // ===========================================
    // SLIDESHOW
    // ===========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;

    function showSlide(index) {
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active-dot'));

        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active-dot');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    setInterval(() => showSlide(currentSlide + 1), 5000);
});
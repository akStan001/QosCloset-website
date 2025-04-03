
       import {products} from './products.js'; 
       
       
       //Product Data with more items
        
        // Cart Data
        let cart = [];

        // DOM Elements
        const productGrid = document.getElementById('productGrid');
        const cartIcon = document.getElementById('cartIcon');
        const cartDropdown = document.getElementById('cartDropdown');
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const hero = document.getElementById('hero');
        const productsTitle = document.getElementById('productsTitle');

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            // Load products
            renderProducts();

            // Set up event listeners
            cartIcon.addEventListener('click', toggleCart);
            checkoutBtn.addEventListener('click', checkout);

            // Check if elements are in view
            checkIfInView();

            // Add scroll event listener for animations
            window.addEventListener('scroll', checkIfInView);
        });

        // Render products to the page
        function renderProducts() {
            productGrid.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-price">₦${product.price.toLocaleString()}</p>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                `;
                productGrid.appendChild(productCard);

                // Add event listener to the button
                const addButton = productCard.querySelector('.add-to-cart');
                addButton.addEventListener('click', () => {
                    addToCart(product);
                    animateAddToCart(addButton);
                });
            });
        }

        // Add product to cart with animation
        function addToCart(product) {
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification(product.title);
        }

        // Animate the add to cart button
        function animateAddToCart(button) {
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            
            setTimeout(() => {
                button.classList.remove('added');
                button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 2000);
        }

        // Update cart UI
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            cartItems.innerHTML = '';
            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-price">₦${item.price.toLocaleString()} x ${item.quantity}</p>
                            <p class="remove-item" data-id="${item.id}">Remove</p>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        removeFromCart(id);
                    });
                });
            }
            
            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toLocaleString();
        }

        // Remove item from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
            showCartNotification('Item removed');
        }

        // Toggle cart dropdown
        function toggleCart() {
            cartDropdown.classList.toggle('active');
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });

        // Checkout function
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Create WhatsApp message
            const itemsList = cart.map(item => 
                `${item.title} (${item.quantity} x ₦${item.price.toLocaleString()})`
            ).join('%0A- ');
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const message = `Hello! I want to order:%0A%0A- ${itemsList}%0A%0ATotal: ₦${total.toLocaleString()}%0A%0AMy details:`;
            
            // Open WhatsApp with the message
            window.open(`https://wa.me/2348121403802?text=${message}`, '_blank');
        }

        // Show notification when item is added to cart
        function showCartNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'var(--accent)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            notification.style.zIndex = '1000';
            notification.style.animation = 'fadeIn 0.3s';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Check if elements are in view for animations
        function checkIfInView() {
            const heroPosition = hero.getBoundingClientRect();
            const productsTitlePosition = productsTitle.getBoundingClientRect();
            const productCards = document.querySelectorAll('.product-card');
            
            // Hero animation
            if (heroPosition.top < window.innerHeight - 100) {
                hero.classList.add('visible');
            }
            
            // Products title animation
            if (productsTitlePosition.top < window.innerHeight - 100) {
                productsTitle.classList.add('visible');
            }
            
            // Product cards animation
            productCards.forEach((card, index) => {
                const cardPosition = card.getBoundingClientRect();
                if (cardPosition.top < window.innerHeight - 100) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                }
            });
        }

        // Add CSS for notifications
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    
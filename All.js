document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const shareBtn = document.getElementById('share-btn');
    const cartItems = document.getElementById('cart-items');
    const cartEmptyMsg = document.getElementById('cart-empty');
    const searchField = document.getElementById('search-field');
    const searchIcon = document.getElementById('search-icon');
    const searchMessage = document.getElementById('search-message');
    const itemCards = document.querySelectorAll('.item-card');

    // Toggle cart dropdown visibility
    cartIcon.addEventListener('click', () => {
        const isVisible = cartDropdown.style.display === 'block';
        cartDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Share cart on WhatsApp
    shareBtn.addEventListener('click', () => {
        const cartItemsArray = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Format each item in the cart with bold names and prices
        const cartItemsText = cartItemsArray.map(item => `*${item.name}*: ${item.price}`).join('\n');
    
        const shareText = `Check out my cart:\n${cartItemsText}`;
        const encodedText = encodeURIComponent(shareText);
    
        // Open WhatsApp share link
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    });

    // Add item to cart and save it in localStorage
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemCard = event.target.closest('.item-card');
            const itemName = itemCard.querySelector('h3').innerText;
            const itemPrice = itemCard.querySelector('.price').innerText;
            const itemImageSrc = itemCard.querySelector('img').src;

            const cartItemsArray = JSON.parse(localStorage.getItem('cart')) || [];
            cartItemsArray.push({ name: itemName, price: itemPrice, image: itemImageSrc });
            localStorage.setItem('cart', JSON.stringify(cartItemsArray));

            displayCartItems(); // Update the cart display after adding an item
        });
    });

    // Display cart items from localStorage
    function displayCartItems() {
        const savedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';

        savedCartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price}</div>
                <button class="remove-from-cart">X</button>
            `;
            cartItems.appendChild(listItem);

            // Remove item from cart and update localStorage
            listItem.querySelector('.remove-from-cart').addEventListener('click', () => {
                const updatedCart = savedCartItems.filter(cartItem => cartItem.name !== item.name);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                displayCartItems(); // Refresh cart display after removing an item
            });
        });

        // Show empty message if the cart is empty
        cartEmptyMsg.style.display = savedCartItems.length === 0 ? 'block' : 'none';
    }

    // Display saved cart items on page load
    displayCartItems();

    // Flip items to show description on double-click
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('dblclick', () => {
            card.classList.toggle('flipped');
        });
    });

    // Search functionality
    function searchItems(query) {
        let found = false;
        itemCards.forEach(card => {
            const title = card.querySelector('.item-front h3').textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                applyLightningEffect(card);
                searchMessage.style.display = 'none'; // Hide the "Not found" message if item is found
                found = true;
            }
        });

        if (!found) {
            searchMessage.style.display = 'block'; // Show the "Not found" message if no items match
        }
    }

    searchIcon.addEventListener('click', () => {
        searchItems(searchField.value);
    });

    searchField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchItems(searchField.value);
        }
    });

    function applyLightningEffect(item) {
        item.classList.remove('flash');
        void item.offsetWidth; // Trigger reflow
        item.classList.add('flash');
    }
});

// Save cart and update UI when page is loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

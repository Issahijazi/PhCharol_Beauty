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
        const cartItemsText = Array.from(cartItems.children).map(item => item.innerText).join('\n');
        const shareText = `Check out my cart:\n${cartItemsText}`;
        const encodedText = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    });

    // Add item to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemCard = event.target.closest('.item-card');
            const itemName = itemCard.querySelector('h3').innerText;
            const itemPrice = itemCard.querySelector('.price').innerText;
            const itemImageSrc = itemCard.querySelector('img').src;

            // Get the selected color/shade from the color options
            const selectedColorOption = itemCard.querySelector('.color-option.selected');
            const colorText = selectedColorOption ? ` - ${selectedColorOption.getAttribute('data-color')}` : '';

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${itemImageSrc}" alt="${itemName}">
                <div class="item-name">${itemName}${colorText}</div>
                <div class="item-price">${itemPrice}</div>
                <button class="remove-from-cart">X</button>
            `;
            cartItems.appendChild(listItem);
            cartEmptyMsg.style.display = 'none'; // Hide empty message

            // Remove item from cart
            listItem.querySelector('.remove-from-cart').addEventListener('click', () => {
                cartItems.removeChild(listItem);
                if (cartItems.children.length === 0) {
                    cartEmptyMsg.style.display = 'block'; // Show empty message if no items
                }
            });

            // Animate item card on add to cart
            itemCard.classList.add('item-added');
            setTimeout(() => {
                itemCard.classList.remove('item-added');
            }, 500); // Match the duration of the animation
        });
    });

    // Flip items to show description on double-click
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('dblclick', () => {
            card.classList.toggle('flipped');
        });

        // Handle color option selection
        const colorOptions = card.querySelectorAll('.color-option'); // Select color options within this card
        const itemImage = card.querySelector('img'); // Select the image within this card
        const itemName = card.querySelector('h3');   // Select the name within this card
        const originalItemName = itemName.innerText; // Store the original item name

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected')); // Deselect all options
                option.classList.add('selected'); // Select the clicked option
                const newImageSrc = option.getAttribute('data-image'); // Get new image source from data attribute
                const newColorName = option.getAttribute('data-color'); // Get new color name from data attribute

                // Update the image source and product name (with color)
                itemImage.src = newImageSrc;
                itemName.innerText = `${originalItemName} - ${newColorName}`; // Combine the original name with the selected color
            });
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

    // Save cart and update UI when page is loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Optional: Close the cart dropdown when clicking outside of it
document.addEventListener('click', function(event) {
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
        cartDropdown.style.display = 'none';
    }
});

// Prevent the cart from closing when clicking the 'X' to remove an item
document.getElementById('cart-dropdown').addEventListener('click', function(event) {
    event.stopPropagation(); // Stop the event from bubbling up to the parent
});

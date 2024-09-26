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

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${itemImageSrc}" alt="${itemName}">
                <div class="item-name">${itemName}</div>
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
            } else {
                card.classList.remove('highlight'); // Remove highlight if item is not found
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
        item.classList.remove('flash'); // Remove the effect class if it already exists
        void item.offsetWidth; // Trigger a reflow to restart the animation
        item.classList.add('flash'); // Add the effect class
    }

    // Example of applying the effect after searching
    function handleSearchResult(item) {
        if (item) {
            applyLightningEffect(item);
        } else {
            // Handle case where item is not found
            alert('Not found');
        }
    }

    document.querySelector('#searchButton').addEventListener('click', function() {
        const searchQuery = document.querySelector('#searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.item'); // Adjust this selector to match your item elements
        let found = false;

        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(searchQuery)) {
                handleSearchResult(item);
                found = true;
            }
        });

        if (!found) {
            alert('Not found');
        }
    });
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav ul');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Select all item cards
    const itemCards = document.querySelectorAll('.item-card');

    // Iterate over each card to handle the color option change
    itemCards.forEach(card => {
        const colorOptions = card.querySelectorAll('.color-option'); // Select color options within this card
        const itemImage = card.querySelector('img'); // Select the image within this card
        const itemName = card.querySelector('h3');   // Select the name within this card
        const originalItemName = itemName.innerText; // Store the original item name

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newImageSrc = option.getAttribute('data-image'); // Get new image source from data attribute
                const newColorName = option.getAttribute('data-color'); // Get new color name from data attribute

                // Update the image source and product name (with color)
                itemImage.src = newImageSrc;
                itemName.innerText = `${originalItemName} - ${newColorName}`; // Combine the original name with the selected color
            });
        });
    });
});
// Function to add item to the cart
function addToCart(itemName, itemPrice, itemImageSrc) {
    // Get current cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    // Add the new item
    cartItems.push({ name: itemName, price: itemPrice, image: itemImageSrc });
    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Function to display cart items
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = ''; // Clear existing items

    cartItems.forEach(item => {
        const newItem = document.createElement('li');
        newItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price}</span>
            <button class="remove-from-cart" onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartList.appendChild(newItem);
    });
}

// Function to remove item from cart
function removeFromCart(itemName) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.name !== itemName); // Filter out the item to remove
    localStorage.setItem('cart', JSON.stringify(cartItems)); // Save updated cart
    displayCartItems(); // Refresh the displayed cart
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const itemCard = event.target.closest('.item-card');
        const itemName = itemCard.querySelector('.item-name').innerText;
        const itemPrice = itemCard.querySelector('.price').innerText;
        const itemImageSrc = itemCard.querySelector('img').src;

        addToCart(itemName, itemPrice, itemImageSrc); // Call function to add item
        displayCartItems(); // Update displayed cart items
    });
});

// Load cart items on page load
window.onload = function() {
    displayCartItems();
};


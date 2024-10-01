// Select elements
const categoryButtons = document.querySelectorAll('.category-btn');
const carouselWrapper = document.getElementById('carousel-wrapper');
const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-btn');
const addItemButton = document.getElementById('add-item-btn');
const cartSection = document.querySelector('.cart-section');
const popup = document.getElementById('popup-form');
const itemForm = document.getElementById('item-form');
const itemNameInput = document.getElementById('item-name');
const itemCategoryInput = document.getElementById('item-category');
const itemImageInput = document.getElementById('item-image');
const itemPriceInput = document.getElementById('item-price');
const closePopupButton = document.getElementById('close-popup-btn');
const searchBar = document.getElementById('search-bar');
const editPopup = document.getElementById('edit-popup-form');
const editItemForm = document.getElementById('edit-item-form');
const editItemNameInput = document.getElementById('edit-item-name');
const editItemCategoryInput = document.getElementById('edit-item-category');
const editItemImageInput = document.getElementById('edit-item-image-file');
const editItemPriceInput = document.getElementById('edit-item-price');
const closeEditPopupButton = document.getElementById('close-edit-popup-btn');
const existingImage = document.getElementById('existing-image');

let menuItems = document.querySelectorAll('.menu-item');
let cart = []; // Initialize cart

// Popup Functions
function openPopup() {
    popup.style.display = 'block';
    setTimeout(() => popup.classList.add('show'), 10);
}

function closePopup() {
    popup.classList.remove('show');
    setTimeout(() => popup.style.display = 'none', 300);
}

function openEditPopup(itemId) {
    const item = document.querySelector(`.menu-item img[data-id="${itemId}"]`).closest('.menu-item');
    if (item) {
        editItemNameInput.value = item.querySelector('h3').textContent;
        editItemCategoryInput.value = item.dataset.category;
        editItemPriceInput.value = item.querySelector('.menu-item-details p:nth-of-type(2)').textContent.replace('Price: $', '');

        document.getElementById('edit-item-id').value = itemId;
        existingImage.src = item.querySelector('.item-img').src;
        existingImage.style.display = 'block';

        editPopup.style.display = 'block';
        setTimeout(() => editPopup.classList.add('show'), 10);
    }
}

function closeEditPopup() {
    editPopup.classList.remove('show');
    setTimeout(() => editPopup.style.display = 'none', 300);
}

// Menu and Cart Functions
function populateMenu(category) {
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function addToCart(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (!item) return;

    const productName = item.querySelector('h3').textContent;
    const price = parseFloat(item.querySelector('.menu-item-details p:nth-of-type(2)').textContent.replace('Price: $', ''));
    const quantity = parseInt(item.querySelector('.menu-item-details p:nth-of-type(4)').textContent.replace('Quantity: ', ''));

    if (isNaN(price) || isNaN(quantity)) return;

    const existingItem = cart.find(cartItem => cartItem.ProductName === productName);
    if (existingItem) {
        existingItem.Quantity += quantity;
    } else {
        cart.push({ ProductName: productName, Price: price, Quantity: quantity });
    }

    updateCart();
}

function updateCart() {
    cartList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.ProductName} - $${(item.Price * item.Quantity).toFixed(2)} (x${item.Quantity})`;
        cartList.appendChild(li);

        totalPrice += item.Price * item.Quantity;
    });

    totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Item Handling Functions
function handleAddItem(event) {
    event.preventDefault();

    const productName = itemNameInput.value.trim();
    const category = itemCategoryInput.value;
    const price = parseFloat(itemPriceInput.value.trim());
    const file = itemImageInput.files[0];

    if (!productName || !category || isNaN(price) || !file) {
        Swal.fire('Please fill in all fields and upload an image.', '', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target.result;
        const newItemID = Date.now();

        const newItemHTML = `
            <div class="menu-item" data-category="${category}">
                <div class="menu-item-content">
                    <button class="edit-btn" data-id="${newItemID}">Edit</button>
                    <button class="remove-btn" data-id="${newItemID}">X</button> 
                    <img src="${imageUrl}" alt="${productName}" class="item-img" data-id="${newItemID}">
                    <h3>${productName}</h3>
                </div>
                <div class="menu-item-details">
                    <p>Brand: New Brand</p>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Weight/Volume: 1 lb</p>
                    <p>Quantity: 1</p>
                </div>
            </div>
        `;

        carouselWrapper.insertAdjacentHTML('beforeend', newItemHTML);
        itemForm.reset();
        closePopup();

        menuItems = document.querySelectorAll('.menu-item');
        populateMenu(category);
    };

    reader.readAsDataURL(file);
}

function handleEditItem(event) {
    event.preventDefault();

    const itemId = document.getElementById('edit-item-id').value;
    const name = editItemNameInput.value.trim();
    const category = editItemCategoryInput.value;
    const price = parseFloat(editItemPriceInput.value.trim());
    const file = editItemImageInput.files[0];

    if (!name || !category || isNaN(price)) {
        Swal.fire('Please fill in all fields.', '', 'warning');
        return;
    }

    const item = document.querySelector(`.menu-item img[data-id="${itemId}"]`).closest('.menu-item');
    if (item) {
        item.querySelector('h3').textContent = name;
        item.querySelector('.menu-item-details p:nth-of-type(2)').textContent = `Price: $${price.toFixed(2)}`;
        item.dataset.category = category;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                item.querySelector('.item-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        closeEditPopup();
    }
}

// REMOVE ITEM
function removeItem(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (item) {
        item.remove();
        cart = cart.filter(cartItem => cartItem.ProductName !== item.querySelector('h3').textContent);
        updateCart();
    }
}

// Search Function
function handleSearch() {
    const query = searchBar.value.toLowerCase();

    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const itemDescription = item.querySelector('.menu-item-details p:nth-of-type(1)').textContent.toLowerCase();

        if (itemName.includes(query) || itemDescription.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        populateMenu(category);

        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

carouselWrapper.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('item-img')) {
        addToCart(target.getAttribute('data-id'));
    } else if (target.classList.contains('edit-btn')) {
        openEditPopup(target.getAttribute('data-id'));
    } else if (target.classList.contains('remove-btn')) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it'
        }).then(result => {
            if (result.isConfirmed) {
                removeItem(target.getAttribute('data-id'));
                Swal.fire('Removed!', 'The item has been removed.', 'success');
            }
        });
    }
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Your cart is empty!', 'Please add some items before checking out.', 'warning');
    } else {
        Swal.fire('Purchase Successful!', 'Your order has been placed.', 'success');
        cart = [];
        updateCart();
    }
});

searchBar.addEventListener('input', handleSearch);
addItemButton.addEventListener('click', openPopup);
closePopupButton.addEventListener('click', closePopup);
closeEditPopupButton.addEventListener('click', closeEditPopup);
itemForm.addEventListener('submit', handleAddItem);
editItemForm.addEventListener('submit', handleEditItem);

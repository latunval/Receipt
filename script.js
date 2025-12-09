document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('receiptForm');
    const addItemBtn = document.getElementById('addItem');
    const itemsList = document.getElementById('itemsList');
    const printBtn = document.getElementById('printReceipt');
    const generateRandomBtn = document.getElementById('generateRandom');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;
    
    // Load saved data or add sample items
    loadFromLocalStorage();
    
    // Generate Random Receipt functionality
    generateRandomBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('items-data.json');
            const data = await response.json();
            
            // Clear existing items
            itemsList.innerHTML = '';
            
            // Get random number of items (5-12 items)
            const numItems = Math.floor(Math.random() * 8) + 5;
            const allItems = [];
            
            // Flatten all items from all categories
            data.target_items.forEach(category => {
                category.items.forEach(item => {
                    allItems.push({
                        name: item.name,
                        price: item.price,
                        category: category.category
                    });
                });
            });
            
            // Shuffle and select random items
            const shuffled = allItems.sort(() => 0.5 - Math.random());
            const selectedItems = shuffled.slice(0, numItems);
            
            // Add selected items to form
            selectedItems.forEach(item => {
                addItemRow(item.name, item.price);
            });
            
            // Save and update receipt
            saveToLocalStorage();
            updateReceipt();
            
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Failed to load items. Please make sure items-data.json exists.');
        }
    });
    
    // Add item functionality
    addItemBtn.addEventListener('click', function() {
        addItemRow();
        saveToLocalStorage();
        updateReceipt();
    });
    
    // Remove item functionality
    itemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            if (itemsList.children.length > 1) {
                e.target.parentElement.remove();
                saveToLocalStorage();
                updateReceipt();
            }
        }
    });
    
    // Update receipt on input changes
    form.addEventListener('input', function() {
        saveToLocalStorage();
        updateReceipt();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveToLocalStorage();
        updateReceipt();
    });
    
    // Print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    function addItemRow(name = '', price = '') {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" class="item-name" placeholder="Item name" value="${name}" required>
            <input type="number" class="item-price" placeholder="0.00" step="0.01" min="0" value="${price}" required>
            <button type="button" class="remove-item">Remove</button>
        `;
        itemsList.appendChild(itemRow);
    }
    
    function addSampleItems() {
        // Clear existing items first
        itemsList.innerHTML = '';
        
        // Add sample items from the Target receipt image
        addItemRow('FIVE TRAIL WHISKEY', '500.00');
        addItemRow('DOVE CREAM SERUM', '200.00');
        addItemRow('BARMEN 1873', '250.00');
        addItemRow('GREENIES CANINE TREATS (PETCO)', '0.00');
        addItemRow('RUFFINO WINE', '180.00');
        addItemRow('RUFFINO WINE', '200.00');
        addItemRow('ABSOLUT AND KALMETICS', '210.00');
    }
    
    function updateReceipt() {
        const storeName = document.getElementById('storeName').value || 'TARGET';
        const storeLocation = document.getElementById('storeLocation').value || 'NEW YORK';
        const receiptDate = document.getElementById('receiptDate').value;
        
        // Update store info
        document.querySelector('.store-name').textContent = storeName;
        document.getElementById('storeInfo').textContent = `STORE #T-1017, 123 BROADWAY, ${storeLocation}, NY`;
        
        // Update items
        const receiptItems = document.getElementById('receiptItems');
        receiptItems.innerHTML = '';
        
        let subtotal = 0;
        const itemRows = document.querySelectorAll('.item-row');
        
        itemRows.forEach(row => {
            const nameInput = row.querySelector('.item-name');
            const priceInput = row.querySelector('.item-price');
            
            if (nameInput.value && priceInput.value !== '') {
                const price = parseFloat(priceInput.value) || 0;
                subtotal += price;
                
                const receiptItem = document.createElement('div');
                receiptItem.className = 'receipt-item';
                
                // Format price display
                let priceDisplay;
                if (price === 0) {
                    priceDisplay = 'OO';
                } else {
                    priceDisplay = '$' + price.toFixed(2);
                }
                
                receiptItem.innerHTML = `
                    <div class="item-description">${nameInput.value.toUpperCase()}</div>
                    <div class="item-amount">${priceDisplay}</div>
                `;
                receiptItems.appendChild(receiptItem);
            }
        });
        
        // Calculate tax (approximately 10.23% based on the receipt)
        const tax = subtotal * 0.1023;
        const total = subtotal + tax;
        
        // Update subtotal, tax, and total
        document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        
        // Update date and time
        if (receiptDate) {
            const date = new Date(receiptDate + 'T11:15:00');
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const formattedTime = `${displayHours}:${minutes} ${ampm}`;
            
            document.getElementById('receiptDateLine').textContent = `DATE: ${formattedDate}`;
            document.getElementById('receiptTime').textContent = `TIME: ${formattedTime}`;
        }
    }
    
    // LocalStorage functions
    function saveToLocalStorage() {
        const formData = {
            storeName: document.getElementById('storeName').value,
            storeLocation: document.getElementById('storeLocation').value,
            receiptDate: document.getElementById('receiptDate').value,
            items: []
        };
        
        const itemRows = document.querySelectorAll('.item-row');
        itemRows.forEach(row => {
            const nameInput = row.querySelector('.item-name');
            const priceInput = row.querySelector('.item-price');
            if (nameInput.value || priceInput.value) {
                formData.items.push({
                    name: nameInput.value,
                    price: priceInput.value
                });
            }
        });
        
        // Save current data to history array
        let receiptHistory = JSON.parse(localStorage.getItem('receiptHistory') || '[]');
        receiptHistory.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 receipts
        if (receiptHistory.length > 10) {
            receiptHistory = receiptHistory.slice(-10);
        }
        
        localStorage.setItem('receiptHistory', JSON.stringify(receiptHistory));
        localStorage.setItem('currentReceipt', JSON.stringify(formData));
    }
    
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('currentReceipt');
        
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            // Restore form fields
            document.getElementById('storeName').value = formData.storeName || 'TARGET';
            document.getElementById('storeLocation').value = formData.storeLocation || 'NEW YORK';
            if (formData.receiptDate) {
                document.getElementById('receiptDate').value = formData.receiptDate;
            }
            
            // Clear existing items and restore saved items
            itemsList.innerHTML = '';
            if (formData.items && formData.items.length > 0) {
                formData.items.forEach(item => {
                    addItemRow(item.name, item.price);
                });
            } else {
                addSampleItems();
            }
        } else {
            // No saved data, use sample items
            addSampleItems();
        }
    }
    
    function getReceiptHistory() {
        return JSON.parse(localStorage.getItem('receiptHistory') || '[]');
    }
    
    function getLatestReceipt() {
        const history = getReceiptHistory();
        return history.length > 0 ? history[history.length - 1] : null;
    }
    
    // Initial receipt update
    updateReceipt();
});

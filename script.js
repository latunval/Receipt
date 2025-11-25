document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('receiptForm');
    const addItemBtn = document.getElementById('addItem');
    const itemsList = document.getElementById('itemsList');
    const printBtn = document.getElementById('printReceipt');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;
    
    // Add sample items
    addSampleItems();
    
    // Add item functionality
    addItemBtn.addEventListener('click', function() {
        addItemRow();
    });
    
    // Remove item functionality
    itemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            if (itemsList.children.length > 1) {
                e.target.parentElement.remove();
                updateReceipt();
            }
        }
    });
    
    // Update receipt on input changes
    form.addEventListener('input', function() {
        updateReceipt();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
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
        
        // Add sample items from the receipt image
        addItemRow('DOVE CREAM SERUM', '100.00');
        addItemRow('BLUE BUFFALO DRY DOG FOOD', '80.00');
        addItemRow('BASIL HAYDEN WHISKEY', '68.00');
    }
    
    function updateReceipt() {
        const storeName = document.getElementById('storeName').value || 'TARGET';
        const storeLocation = document.getElementById('storeLocation').value || 'NEW YORK';
        const receiptDate = document.getElementById('receiptDate').value;
        
        // Update store info
        document.querySelector('.store-name').textContent = storeName;
        document.querySelector('.store-location').textContent = storeLocation;
        
        // Update items
        const receiptItems = document.getElementById('receiptItems');
        receiptItems.innerHTML = '';
        
        let total = 0;
        const itemRows = document.querySelectorAll('.item-row');
        
        itemRows.forEach(row => {
            const nameInput = row.querySelector('.item-name');
            const priceInput = row.querySelector('.item-price');
            
            if (nameInput.value && priceInput.value) {
                const price = parseFloat(priceInput.value);
                total += price;
                
                const receiptItem = document.createElement('div');
                receiptItem.className = 'receipt-item';
                receiptItem.innerHTML = `
                    <div class="item-description">${nameInput.value.toUpperCase()}</div>
                    <div class="item-amount">$${price.toFixed(2)}</div>
                `;
                receiptItems.appendChild(receiptItem);
            }
        });
        
        // Update total
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        
        // Update date
        if (receiptDate) {
            const date = new Date(receiptDate);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            document.querySelector('.receipt-date').textContent = formattedDate;
        }
    }
    
    // Initial receipt update
    updateReceipt();
});
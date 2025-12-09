document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('walmartForm');
    const addItemBtn = document.getElementById('addItem');
    const itemsList = document.getElementById('itemsList');
    const receiptItems = document.getElementById('receiptItems');
    const printBtn = document.getElementById('printReceipt');
    const generateRandomBtn = document.getElementById('generateRandom');
    
    // Set current date and time
    const now = new Date();
    document.getElementById('receiptDate').value = now.toISOString().split('T')[0];
    document.getElementById('receiptTime').value = now.toTimeString().slice(0, 5);
    
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
                const itemRow = document.createElement('div');
                itemRow.className = 'item-row';
                
                // Generate random item code
                const itemCode = Math.floor(Math.random() * 900000000) + 100000000;
                
                itemRow.innerHTML = `
                    <input type="text" class="item-name" placeholder="Item name" value="${item.name}" required>
                    <input type="text" class="item-code" placeholder="Item code" value="${itemCode}" required>
                    <input type="number" class="item-price" placeholder="0.00" step="0.01" min="0" value="${item.price}" required>
                    <button type="button" class="remove-item">Remove</button>
                `;
                itemsList.appendChild(itemRow);
                
                // Add remove functionality
                itemRow.querySelector('.remove-item').addEventListener('click', function() {
                    itemRow.remove();
                });
            });
            
            // Automatically generate the receipt
            generateReceipt();
            
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Failed to load items. Please make sure items-data.json exists.');
        }
    });
    
    // Add item functionality
    addItemBtn.addEventListener('click', function() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" class="item-name" placeholder="Item name" required>
            <input type="text" class="item-code" placeholder="Item code" required>
            <input type="number" class="item-price" placeholder="0.00" step="0.01" min="0" required>
            <button type="button" class="remove-item">Remove</button>
        `;
        itemsList.appendChild(itemRow);
        
        // Add remove functionality to new item
        itemRow.querySelector('.remove-item').addEventListener('click', function() {
            itemRow.remove();
        });
    });
    
    // Remove item functionality for existing items
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            e.target.parentElement.remove();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateReceipt();
    });
    
    // Print functionality
    printBtn.addEventListener('click', function() {
        const receiptContent = document.getElementById('receipt').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Walmart Receipt</title>
                    <style>
                        body { font-family: 'Courier New', monospace; font-size: 12px; }
                        .walmart-receipt { max-width: 300px; margin: 0 auto; }
                    </style>
                </head>
                <body>
                    <div class="walmart-receipt">${receiptContent}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });
    
    function generateReceipt() {
        const storeNumber = document.getElementById('storeNumber').value;
        const storeLocation = document.getElementById('storeLocation').value;
        const managerName = document.getElementById('managerName').value;
        const receiptDate = document.getElementById('receiptDate').value;
        const receiptTime = document.getElementById('receiptTime').value;
        
        // Update store info
        document.getElementById('storeAddress').textContent = `${storeNumber} ${storeLocation}`;
        
        // Get all items
        const itemRows = document.querySelectorAll('.item-row');
        let subtotal = 0;
        let itemCount = 0;
        
        // Clear existing items
        receiptItems.innerHTML = '';
        
        // Add items to receipt
        itemRows.forEach(row => {
            const name = row.querySelector('.item-name').value;
            const code = row.querySelector('.item-code').value;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            
            if (name && price > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'receipt-item';
                itemDiv.innerHTML = `
                    <div class="item-details">
                        <div>${name.toUpperCase()}</div>
                        <div class="item-code">${code}</div>
                    </div>
                    <div>$${price.toFixed(2)}</div>
                `;
                receiptItems.appendChild(itemDiv);
                
                subtotal += price;
                itemCount++;
            }
        });
        
        // Calculate tax (6.5%)
        const tax = subtotal * 0.065;
        const total = subtotal + tax;
        
        // Update totals
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('paymentAmount').textContent = `$${total.toFixed(2)}`;
        
        // Update receipt meta info
        const formattedDate = new Date(receiptDate + 'T' + receiptTime).toLocaleDateString('en-US');
        const formattedTime = new Date(receiptDate + 'T' + receiptTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        document.getElementById('receiptDateTime').textContent = `# ITEMS SOLD ${itemCount}`;
        
        // Update footer timestamp
        const footerTimestamp = document.querySelector('.footer-message p');
        footerTimestamp.textContent = `${formattedDate.replace(/\//g, '/')} ${formattedTime}`;
        
        // Generate random transaction ID
        const transactionId = Math.random().toString().substr(2, 20).match(/.{1,4}/g).join(' ');
        document.getElementById('transactionId').textContent = `TC# ${transactionId}`;
    }
});
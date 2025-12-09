// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getCurrentDateTime() {
    const now = new Date();
    return {
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        })
    };
}

function generateReceiptId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// // Theme toggle functionality
// function toggleTheme() {
//     document.body.classList.toggle('dark-theme');
//     localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
// }

// // Load saved theme
// function loadTheme() {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//         document.body.classList.add('dark-theme');
//     }
// }
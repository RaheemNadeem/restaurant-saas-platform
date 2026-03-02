const http = require('http');

const data = JSON.stringify({
    subtotal: 29.30,
    couponCode: null,
    items: [
        {
            menuItemId: "item-1",
            name: "Chicken Shawarma Wrap",
            quantity: 1,
            price: 12.90
        },
        {
            menuItemId: "item-2",
            name: "Falafel Bowl",
            quantity: 1,
            price: 11.50
        }
    ]
});

const options = {
    hostname: 'localhost',
    port: 5173,
    path: '/api/orders/checkout',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => {
        body += d;
    });
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${body}`);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();

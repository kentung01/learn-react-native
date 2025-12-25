
import fetch from 'node-fetch'; // Standard available in node 18+ (or global fetch)
// If node < 18, we might need to rely on global fetch if experimental enabled or use http builtin.
// Let's assume global fetch is available since I am using "type": "module" and likely node 18+.
// If not, I'll use http module. Let's start with http module to be safe and dependency-free.

import http from 'http';

function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = http.request(opts, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting API Tests');
    console.log('=====================');

    // Test 1: Search Vehicles
    try {
        console.log('\n1️⃣  Testing GET /api/vehicles/search?plate=B');
        const res1 = await request('/api/vehicles/search?plate=B');
        console.log(`Status: ${res1.status}`);
        console.log('Result:', JSON.stringify(res1.data, null, 2));
    } catch (e) { console.error('Failed:', e.message); }

    // Test 2: Search Items
    try {
        console.log('\n2️⃣  Testing GET /api/items/search?q=oli');
        const res2 = await request('/api/items/search?q=oli');
        console.log(`Status: ${res2.status}`);
        console.log('Result:', JSON.stringify(res2.data, null, 2));
    } catch (e) { console.error('Failed:', e.message); }

    // Test 3: Create Invoice (Hybrid)
    try {
        console.log('\n3️⃣  Testing POST /api/invoices (Hybrid)');
        const payload = {
            "plateNumber": "DK 8888 TEST",
            "vehicleModel": "Toyota Test",
            "customerName": "Pak Tester",
            "customerPhone": "08999999999",
            "items": [
                {
                    "type": "MANUAL",
                    "refId": null,
                    "name": "Jasa Test",
                    "qty": 1,
                    "price": 50000
                }
            ],
            "discount": 0
        };

        const res3 = await request('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        console.log(`Status: ${res3.status}`);
        console.log('Result:', JSON.stringify(res3.data, null, 2));

        if (res3.data.data && res3.data.data.id) {
            // Test 4: Get Invoice Details
            try {
                console.log(`\n4️⃣  Testing GET /api/invoices/${res3.data.data.id}`);
                const res4 = await request(`/api/invoices/${res3.data.data.id}`);
                console.log(`Status: ${res4.status}`);
                console.log('Result Summary:', res4.data.success ? 'Success' : 'Failed');
            } catch (e) { console.error('Failed:', e.message); }
        }

    } catch (e) { console.error('Failed:', e.message); }

    console.log('\n=====================');
    console.log('✅ Tests Completed');
}

runTests();

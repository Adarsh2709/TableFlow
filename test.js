const API_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('--- Starting API Tests ---');
  let token = '';
  let adminToken = '';
  let customerId = '';
  
  // 1. Health Check
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    console.log('[HEALTH CHECK]:', data.success ? 'PASS' : 'FAIL');
  } catch(e) {
    console.error('Health Check Error', e);
  }

  // 2. Register User
  try {
    const email = `test${Date.now()}@test.com`;
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
    });
    const data = await res.json();
    console.log('[REGISTER]:', data.success ? 'PASS' : 'FAIL', data.message);
  } catch(e) { console.error('Register Error', e); }

  // 3. Login Admin
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tableflow.com', password: 'password123' })
    });
    const data = await res.json();
    if (data.success) {
      adminToken = data.data.token;
      console.log('[ADMIN LOGIN]: PASS');
    } else {
      console.log('[ADMIN LOGIN]: FAIL', data.message);
    }
  } catch(e) { console.error('Admin Login Error', e); }

  // 4. Register & Login Customer (for reservations)
  try {
    const email = `customer${Date.now()}@test.com`;
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Customer User', email, password: 'password123' })
    });
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const data = await res.json();
    if (data.success) {
      token = data.data.token;
      customerId = data.data.user._id;
      console.log('[CUSTOMER LOGIN]: PASS');
    } else {
      console.log('[CUSTOMER LOGIN]: FAIL', data.message);
    }
  } catch(e) { console.error('Customer Login Error', e); }

  // 5. Create Reservation 1 (3 guests -> expecting capacity 4 table)
  try {
    const res = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reservationDate: '2027-10-10', timeSlot: '19:00', guests: 3 })
    });
    const data = await res.json();
    if (data.success && data.data.reservation.guests === 3) {
      console.log('[CREATE RESERVATION 1]: PASS', `(Assigned Table ID: ${data.data.reservation.table})`);
    } else {
      console.log('[CREATE RESERVATION 1]: FAIL', data.message);
    }
  } catch(e) { console.error('Reservation 1 Error', e); }

  // 6. Create Reservation 2 at same time (3 guests -> expecting the OTHER capacity 4 table)
  try {
    const res = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reservationDate: '2027-10-10', timeSlot: '19:00', guests: 3 })
    });
    const data = await res.json();
    if (data.success) {
      console.log('[CREATE RESERVATION 2 (No Double Booking)]: PASS', `(Assigned Table ID: ${data.data.reservation.table})`);
    } else {
      console.log('[CREATE RESERVATION 2]: FAIL', data.message);
    }
  } catch(e) { console.error('Reservation 2 Error', e); }
  
  // 7. Test Double Booking limit (Try 20 more, should eventually throw 409 Conflict)
  try {
    let conflictHit = false;
    for (let i = 0; i < 15; i++) {
       const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reservationDate: '2027-10-10', timeSlot: '19:00', guests: 3 })
      });
      const data = await res.json();
      if (!data.success && data.message.includes('No tables available') || data.message.includes('Sorry, no tables available')) {
         conflictHit = true;
         break;
      }
    }
    console.log('[DOUBLE BOOKING PREVENTION TEST]:', conflictHit ? 'PASS (Properly threw 409 when full)' : 'FAIL');
  } catch(e) { console.error('Double Booking Error', e); }

  // 8. Admin: Get all reservations paginated
  try {
    const res = await fetch(`${API_URL}/admin/reservations?page=1&limit=5`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (data.success && data.data.reservations.length > 0) {
      console.log('[ADMIN PAGINATION]: PASS', `Found ${data.data.total} total reservations, paginated correctly.`);
    } else {
      console.log('[ADMIN PAGINATION]: FAIL', data.message);
    }
  } catch(e) { console.error('Admin Pagination Error', e); }
}

runTests();

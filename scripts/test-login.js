// Script to test the login API
import fetch from 'node-fetch';

async function testLogin() {
  try {
    // Test admin login
    console.log('Testing admin login...');
    const adminResponse = await fetch('http://localhost:3000/api/auth/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@yieldguru.co',
        password: 'Admin@123',
      }),
    });

    const adminData = await adminResponse.json();
    console.log(`Admin login status: ${adminResponse.status}`);
    console.log('Admin login response:', adminData);

    // Test investor login
    console.log('\nTesting investor login...');
    const investorResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'investor@test.com',
        password: 'Investor123!',
      }),
    });

    const investorData = await investorResponse.json();
    console.log(`Investor login status: ${investorResponse.status}`);
    console.log('Investor login response:', investorData);

    // Test operator login
    console.log('\nTesting operator login...');
    const operatorResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'operator@test.com',
        password: 'Operator123!',
      }),
    });

    const operatorData = await operatorResponse.json();
    console.log(`Operator login status: ${operatorResponse.status}`);
    console.log('Operator login response:', operatorData);

  } catch (error) {
    console.error('Error testing login:', error);
  }
}

// Run the function
testLogin();

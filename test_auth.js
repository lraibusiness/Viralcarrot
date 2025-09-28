const fs = require('fs');
const path = require('path');

// Load users
function loadUsers() {
  try {
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

// Test token parsing
function getUserByToken(token) {
  if (!token) {
    console.log('❌ No token provided');
    return null;
  }
  
  console.log('🔍 Parsing token:', token);
  
  // Parse token: token_userId_timestamp
  const parts = token.split('_');
  console.log('Token parts:', parts);
  
  if (parts.length < 3 || parts[0] !== 'token') {
    console.log('❌ Invalid token format:', token);
    return null;
  }
  
  const userId = parts[1];
  console.log('User ID from token:', userId);
  
  if (!userId) {
    console.log('❌ No user ID in token');
    return null;
  }
  
  const users = loadUsers();
  console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
  
  const user = users.find(u => u.id === userId);
  
  if (user) {
    console.log(`✅ Token validated for user: ${user.email} (ID: ${user.id})`);
  } else {
    console.log(`❌ Token validation failed - user not found for ID: ${userId}`);
  }
  
  return user || null;
}

// Test with the actual token
const token = 'token_user_1759071482604_1759071538148';
console.log('Testing token:', token);
const user = getUserByToken(token);
console.log('Result:', user);

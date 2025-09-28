const fs = require('fs');
const path = require('path');

// Load existing users
const usersFile = path.join(process.cwd(), 'data', 'users.json');
let users = [];

try {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(data);
  }
} catch (error) {
  console.error('Error loading users:', error);
}

// Create admin user
const adminUser = {
  id: `user_${Date.now()}`,
  email: 'admin@viralcarrot.com',
  name: 'Admin User',
  role: 'admin',
  subscription: {
    plan: 'pro',
    status: 'active'
  },
  profile: {
    preferences: {
      cuisine: [],
      dietaryRestrictions: [],
      cookingSkill: 'advanced'
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Check if admin already exists
const existingAdmin = users.find(u => u.email === 'admin@viralcarrot.com');
if (existingAdmin) {
  console.log('Admin user already exists:', existingAdmin.email);
} else {
  users.push(adminUser);
  
  // Save users
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@viralcarrot.com');
    console.log('Password: admin123 (use any password for testing)');
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

/**
 * Simple Database Service for AgriGrow
 * Structured to behave like a real API for easy future migration.
 */

const DB_KEY = 'ag_db_users';

// Test users for development
const TEST_USERS = [
    {
        id: '1',
        name: 'Raj Kumar',
        email: 'raj@agrigrow.com',
        phone: '9876543210',
        password: 'password123',
        gender: 'Male',
        location: { name: 'Punjab', lat: 31.1471, lon: 74.8755 },
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&style=circle',
        createdAt: new Date('2024-01-15').toISOString()
    },
    {
        id: '2',
        name: 'Priya Singh',
        email: 'priya@agrigrow.com',
        phone: '9876543211',
        password: 'password123',
        gender: 'Female',
        location: { name: 'Haryana', lat: 29.0588, lon: 77.0745 },
        profileImage: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emma',
        createdAt: new Date('2024-02-10').toISOString()
    }
];

const getUsers = () => {
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
};

// Initialize with test data if empty
const initializeTestData = () => {
    try {
        const users = getUsers();
        if (users.length === 0) {
            console.log('Initializing test data...');
            saveUsers(TEST_USERS);
            console.log('Test data initialized:', TEST_USERS);
        } else {
            console.log('Users already exist:', users.length);
        }
    } catch (error) {
        console.error('Error initializing test data:', error);
    }
};

// Initialize on module load
initializeTestData();

export const db = {
    // Initialize test data (manual call if needed)
    initializeTestData: () => {
        initializeTestData();
    },

    // Reset and reload test data (manual reset)
    resetTestData: () => {
        console.log('🔄 Resetting test data...');
        localStorage.removeItem(DB_KEY);
        initializeTestData();
        console.log('✅ Test data reset complete');
    },

    // Register a new user
    register: async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();

                // Check if user already exists
                const exists = users.find(u => u.email === userData.email || u.phone === userData.phone);
                if (exists) {
                    return reject(new Error('User with this email or phone already exists.'));
                }

                const newUser = {
                    ...userData,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                saveUsers(users);

                // Set as current user
                localStorage.setItem('ag_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    },

    // Login existing user
    login: async (identifier, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Fallback: Ensure test data exists
                let users = getUsers();
                if (users.length === 0) {
                    console.warn('⚠️ No users found, re-initializing test data...');
                    saveUsers(TEST_USERS);
                    users = getUsers();
                }

                console.log('🔍 Attempting login with identifier:', identifier);
                console.log('📦 Available users:', users.map(u => ({ email: u.email, phone: u.phone })));
                
                const user = users.find(u => {
                    const emailMatch = u.email === identifier;
                    const phoneMatch = u.phone === identifier;
                    const passwordMatch = u.password === password;
                    
                    console.log(`Checking user ${u.email}:`, { emailMatch, phoneMatch, passwordMatch });
                    
                    return (emailMatch || phoneMatch) && passwordMatch;
                });

                if (user) {
                    console.log('✅ Login successful for user:', user.name);
                    localStorage.setItem('ag_user', JSON.stringify(user));
                    resolve(user);
                } else {
                    console.error('❌ Login failed - Invalid credentials');
                    reject(new Error('Invalid credentials.'));
                }
            }, 800);
        });
    },

    // Google Login (Social)
    socialLogin: async (profile) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = getUsers();
                let user = users.find(u => u.email === profile.email);

                if (!user) {
                    // Auto-register if not exists
                    user = {
                        ...profile,
                        id: Date.now().toString(),
                        isSocial: true,
                        createdAt: new Date().toISOString()
                    };
                    users.push(user);
                    saveUsers(users);
                }

                localStorage.setItem('ag_user', JSON.stringify(user));
                resolve(user);
            }, 1000);
        });
    },

    // Update profile
    updateProfile: async (userId, updates) => {
        return new Promise((resolve, reject) => {
            const users = getUsers();
            const index = users.findIndex(u => u.id === userId);
            if (index === -1) return reject(new Error('User not found'));

            users[index] = { ...users[index], ...updates };
            saveUsers(users);

            // Update session if it's the current user
            const currentUser = JSON.parse(localStorage.getItem('ag_user'));
            if (currentUser && currentUser.id === userId) {
                localStorage.setItem('ag_user', JSON.stringify(users[index]));
            }

            resolve(users[index]);
        });
    }
};

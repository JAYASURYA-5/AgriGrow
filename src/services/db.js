/**
 * Simple Database Service for AgriGrow
 * Structured to behave like a real API for easy future migration.
 */

const DB_KEY = 'ag_db_users';

const getUsers = () => {
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
};

export const db = {
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
                const users = getUsers();
                const user = users.find(u =>
                    (u.email === identifier || u.phone === identifier) && u.password === password
                );

                if (user) {
                    localStorage.setItem('ag_user', JSON.stringify(user));
                    resolve(user);
                } else {
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

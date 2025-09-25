function login(username, password) {
    // Simulate an API call for user authentication
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true; // Login successful
    }
    return false; // Login failed
}

function logout() {
    localStorage.removeItem('currentUser');
}

function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function register(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.username === username);

    if (!existingUser) {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        return true; // Registration successful
    }
    return false; // Registration failed, user already exists
}
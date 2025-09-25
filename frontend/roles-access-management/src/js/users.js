// This file manages user-related functionalities, including creating, updating, and deleting users, as well as fetching user data.

const users = [];

// Function to create a new user
function createUser(username, email) {
    const user = {
        id: users.length + 1,
        username: username,
        email: email
    };
    users.push(user);
    return user;
}

// Function to update an existing user
function updateUser(id, updatedData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        return users[userIndex];
    }
    return null;
}

// Function to delete a user
function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0];
    }
    return null;
}

// Function to fetch all users
function fetchUsers() {
    return users;
}

// Function to fetch a user by ID
function fetchUserById(id) {
    return users.find(user => user.id === id) || null;
}
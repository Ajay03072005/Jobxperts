// roles.js

const roles = [];

// Function to create a new role
function createRole(roleName) {
    if (!roleName) {
        console.error("Role name is required.");
        return;
    }
    const newRole = { id: roles.length + 1, name: roleName };
    roles.push(newRole);
    console.log(`Role "${roleName}" created successfully.`);
}

// Function to update an existing role
function updateRole(roleId, newRoleName) {
    const role = roles.find(r => r.id === roleId);
    if (!role) {
        console.error("Role not found.");
        return;
    }
    role.name = newRoleName;
    console.log(`Role updated to "${newRoleName}".`);
}

// Function to delete a role
function deleteRole(roleId) {
    const index = roles.findIndex(r => r.id === roleId);
    if (index === -1) {
        console.error("Role not found.");
        return;
    }
    roles.splice(index, 1);
    console.log(`Role with ID ${roleId} deleted successfully.`);
}

// Function to check user permissions
function checkUserPermission(userRole, requiredRole) {
    return userRole === requiredRole;
}

// Exporting functions for use in other modules
export { createRole, updateRole, deleteRole, checkUserPermission };
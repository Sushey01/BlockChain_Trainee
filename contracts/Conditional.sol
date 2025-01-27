// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoleBasedAccess {
    // State variables
    address public owner;
    
    enum Role { Admin, Editor, Viewer }
    mapping(address => Role) public userRoles;

    // Events
    event RoleAssigned(address indexed user, Role role);
    event RoleRemoved(address indexed user);

    // Constructor to set the deployer as the owner
    constructor() {
        owner = msg.sender;
        userRoles[owner] = Role.Admin; // Assign the owner the admin role
    }

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Function to assign roles to users (onlyOwner can call)
    function assignRole(address _user, Role _role) public onlyOwner {
        userRoles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }

    // Function to remove a role from a user
    function removeRole(address _user) public onlyOwner {
        delete userRoles[_user];
        emit RoleRemoved(_user);
    }

    // Function to check if a user is authorized
    function isAuthorized(address _user, Role _requiredRole) public view returns (bool) {
        return userRoles[_user] == _requiredRole;
    }

    // Function to perform actions based on user roles
    function performRoleBasedAction(Role _requiredRole) public view returns (string memory) {
        // Check if the caller is authorized
        require(isAuthorized(msg.sender, _requiredRole), "Access denied: You are not authorized.");

        // Conditional logic based on the required role
        if (_requiredRole == Role.Admin) {
            return "Admin access granted: You can manage users and settings.";
        } else if (_requiredRole == Role.Editor) {
            return "Editor access granted: You can modify data.";
        } else if (_requiredRole == Role.Viewer) {
            return "Viewer access granted: You can view data.";
        } else {
            revert("Access denied: Invalid role.");
        }
    }

    // Function to get the role of a specific user
    function getUserRole(address _user) public view returns (Role) {
        return userRoles[_user];
    }

    // Function to convert Role enum to string
    function roleToString(Role _role) public pure returns (string memory) {
        if (_role == Role.Admin) {
            return "Admin";
        } else if (_role == Role.Editor) {
            return "Editor";
        } else if (_role == Role.Viewer) {
            return "Viewer";
        } else {
            return "Unknown";
        }
    }
}
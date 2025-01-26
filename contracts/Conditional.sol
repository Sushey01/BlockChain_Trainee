// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoleBasedAccess {
    // State variables
    address public owner;
    mapping(address => string) public userRoles;

    // Constructor to set the deployer as the owner
    constructor() {
        owner = msg.sender;
        userRoles[owner] = "admin"; // Assign the owner the admin role
    }

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Function to assign roles to users (onlyOwner can call)
    function assignRole(address _user, string memory _role) public onlyOwner {
        require(bytes(_role).length > 0, "Role cannot be empty.");
        userRoles[_user] = _role;
    }

    // Function to perform actions based on user roles
    function performRoleBasedAction() public view returns (string memory) {
        // Check the role of the caller
        if (keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("admin"))) {
            return "Admin access granted: You can manage users and settings.";
        } else if (keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("editor"))) {
            return "Editor access granted: You can modify data.";
        } else if (keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("viewer"))) {
            return "Viewer access granted: You can view data.";
        } else {
            return "Access denied: You do not have a valid role.";
        }
    }

    // Function to get the role of a specific user
    function getUserRole(address _user) public view returns (string memory) {
        return userRoles[_user];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EvidenceToken is ERC20, Ownable {
    mapping(address => bool) private auditors;
    mapping(address => bool) private whitelistedUsers;

    event AdminAdded(address indexed admin);
    event AuditorAdded(address indexed auditor);
    event WhitelistedUserAdded(address indexed user);

    constructor() ERC20("EvidenceToken", "EVT") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial mint
    }

    // Admin Functions
    function addAuditor(address _auditor) external onlyOwner {
        require(_auditor != address(0), "Error: Invalid auditor address");
        auditors[_auditor] = true;
        emit AuditorAdded(_auditor);
    }

    function addWhitelistedUser(address _user) external onlyOwner {
        require(_user != address(0), "Error: Invalid user address");
        whitelistedUsers[_user] = true;
        emit WhitelistedUserAdded(_user);
    }

    // Function to issue tokens to auditors or whitelisted users
    function issueTokens(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Function to check evidence
    function checkEvidence() external {
        require(auditors[msg.sender] || whitelistedUsers[msg.sender], "Error: Not authorized");

        // Issue tokens for checking evidence
        _transfer(owner(), msg.sender, 10 * 10 ** decimals()); // Example: 10 tokens
    }

    // Modifiers
    modifier onlyAuditor() {
        require(auditors[msg.sender], "Error: Caller is not an auditor");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelistedUsers[msg.sender] || msg.sender == owner(), "Error: Caller is not authorized");
        _;
    }
}
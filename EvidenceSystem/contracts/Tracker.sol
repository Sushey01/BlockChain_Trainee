// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EvidenceManagementSystem is Ownable, ERC721 {
    // Role mappings
    mapping(address => bool) private auditors;
    mapping(address => bool) private whitelistedUsers;

    // Events
    event AdminAdded(address indexed admin);
    event AuditorAdded(address indexed auditor);
    event WhitelistedUserAdded(address indexed user);
    event CaseRegistered(uint256 indexed caseId, string courtId, string caseDescription, string startDateTime);
    event EvidenceRegistered(
        uint256 indexed caseId,
        uint256 indexed evidenceId,
        string description,
        string fileHash,
        address owner,
        uint256 timestamp,
        string createdDateTime
    );
    event EvidenceNFTRedeemed(uint256 indexed tokenId, address indexed owner);

    // Structs
    struct Evidence {
        string description;
        string fileHash;
        address owner;
        uint256 timestamp;
        string createdDateTime;
    }

    struct Case {
        string courtId;
        string caseDescription;
        uint256 totalEvidences;
        string startDateTime;
        bool initialised;
    }

    // State variables
    uint256 public totalCases = 0;
    uint256 public nextTokenId = 1;
    mapping(uint256 => Case) public cases;
    mapping(uint256 => mapping(uint256 => Evidence)) public evidences;
    mapping(uint256 => uint256) public tokenIdToCaseId;
    mapping(uint256 => uint256) public tokenIdToEvidenceId;

    // Constructor
    constructor()
        ERC721("EvidenceNFT", "EVN") // Pass arguments to ERC721 constructor
        Ownable(msg.sender) // Pass msg.sender to Ownable constructor
    {}

    // Modifiers
    modifier onlyAuditor() {
        require(auditors[msg.sender], "Error: Caller is not an auditor");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelistedUsers[msg.sender] || msg.sender == owner(), "Error: Caller is not authorized");
        _;
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

    // Case Management
    function registerCase(
        string memory _courtId,
        string memory _caseDescription,
        string memory _startDateTime
    ) external onlyWhitelisted {
        require(bytes(_courtId).length > 0, "Error: Court ID cannot be empty");
        require(bytes(_caseDescription).length > 0, "Error: Case description cannot be empty");
        require(bytes(_startDateTime).length > 0, "Error: Start date/time cannot be empty");

        totalCases++;
        Case storage newCase = cases[totalCases];
        newCase.courtId = _courtId;
        newCase.caseDescription = _caseDescription;
        newCase.totalEvidences = 0;
        newCase.startDateTime = _startDateTime;
        newCase.initialised = true;

        emit CaseRegistered(totalCases, _courtId, _caseDescription, _startDateTime);
    }

    // Evidence Management with NFT Minting
    function registerEvidence(
        uint256 _caseId,
        string memory _description,
        string memory _fileHash,
        string memory _createdDateTime
    ) external onlyWhitelisted {
        require(_caseId > 0 && _caseId <= totalCases, "Error: Invalid case ID");
        require(bytes(_description).length > 0, "Error: Description cannot be empty");
        require(bytes(_fileHash).length > 0, "Error: File hash cannot be empty");
        require(bytes(_createdDateTime).length > 0, "Error: Created date/time cannot be empty");

        Case storage contextCase = cases[_caseId];
        require(contextCase.initialised, "Error: Case does not exist");

        uint256 evidenceId = ++contextCase.totalEvidences;
        evidences[_caseId][evidenceId] = Evidence({
            description: _description,
            fileHash: _fileHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            createdDateTime: _createdDateTime
        });

        // Mint an NFT for the evidence
        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId); // Assign the NFT to the evidence uploader

        // Map the token ID to the case and evidence IDs
        tokenIdToCaseId[tokenId] = _caseId;
        tokenIdToEvidenceId[tokenId] = evidenceId;

        emit EvidenceRegistered(_caseId, evidenceId, _description, _fileHash, msg.sender, block.timestamp, _createdDateTime);
    }

    // Redeem NFT to View Evidence Details
    function redeemEvidenceDetails(uint256 tokenId)
        external
        view
        returns (
            string memory description,
            string memory fileHash,
            address owner,
            uint256 timestamp,
            string memory createdDateTime
        )
    {
        // Ensure the token exists by checking the owner
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner != address(0), "Error: Token does not exist");

        // Ensure the caller is authorized
        require(tokenOwner == msg.sender || whitelistedUsers[msg.sender], "Error: Unauthorized access");

        // Retrieve the case and evidence IDs from the token ID mappings
        uint256 caseId = tokenIdToCaseId[tokenId];
        uint256 evidenceId = tokenIdToEvidenceId[tokenId];

        // Retrieve the evidence details
        Evidence storage evd = evidences[caseId][evidenceId];
        return (
            evd.description,
            evd.fileHash,
            evd.owner,
            evd.timestamp,
            evd.createdDateTime
        );
    }
}

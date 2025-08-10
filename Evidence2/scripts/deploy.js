const { ethers } = require("hardhat");
const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Get the contract factory
    const EvidenceTrackerFactory = await ethers.getContractFactory("SimpleEvidenceTracker");
  
    // Deploy the EvidenceTracker contract
    const evidenceTrackerContract = await EvidenceTrackerFactory.deploy();
  
    // Wait for the deployment to be mined
    await evidenceTrackerContract.deployed();
  
    // Get the contract address
    const contractAddress = evidenceTrackerContract.address;
    console.log("Contract address:", contractAddress);

    // Save frontend files (address and ABI)
    saveFrontendFiles(contractAddress);
}

function saveFrontendFiles(contractAddress) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

    // Create the frontend directory if it doesn't exist
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    // Save contract address to a JSON file
    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ SimpleEvidenceTracker: contractAddress }, undefined, 2)
    );

    // Read and save the contract ABI
    const EvidenceTrackerArtifact = artifacts.readArtifactSync("SimpleEvidenceTracker");

    fs.writeFileSync(
        path.join(contractsDir, "SimpleEvidenceTracker.json"),
        JSON.stringify(EvidenceTrackerArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
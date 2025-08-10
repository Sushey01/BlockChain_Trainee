// Import ethers from Hardhat
import { ethers } from "hardhat";

async function main() {
    // Get the contract factory for EvidenceManagementSystem
    const EvidenceManagementSystem = await ethers.getContractFactory("EvidenceManagementSystem");

    // Deploy the contract
    console.log("Deploying EvidenceManagementSystem...");
    const evidenceManagementSystem = await EvidenceManagementSystem.deploy();
    
    // Wait for the deployment transaction to be mined
    await evidenceManagementSystem.waitForDeployment();

    // Log the deployed contract address
    const contractAddress = await evidenceManagementSystem.getAddress();
    console.log("EvidenceManagementSystem deployed to:", contractAddress);

    // Get the signer (default account used for deployment)
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Add an auditor
    console.log("Adding auditor...");
    const auditorAddress = "0xYourAuditorAddress"; // Replace with the actual auditor's address
    const addAuditorTx = await evidenceManagementSystem.addAuditor(auditorAddress);
    await addAuditorTx.wait();
    console.log(`Auditor added: ${auditorAddress}`);

    // Add a whitelisted user
    console.log("Adding whitelisted user...");
    const whitelistedUserAddress = "0xYourWhitelistedUserAddress"; // Replace with the actual user's address
    const addWhitelistedUserTx = await evidenceManagementSystem.addWhitelistedUser(whitelistedUserAddress);
    await addWhitelistedUserTx.wait();
    console.log(`Whitelisted user added: ${whitelistedUserAddress}`);
}

// Run the deployment function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
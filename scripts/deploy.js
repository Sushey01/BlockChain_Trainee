const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy the RoleBasedAccess contract
    const roleBasedAccessContract = await ethers.deployContract("RoleBasedAccess");
  
    // Get the contract address
    const contractAddress = await roleBasedAccessContract.getAddress();
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
        JSON.stringify({ RoleBasedAccess: contractAddress }, undefined, 2)
    );

    // Read and save the contract ABI
    const RoleBasedAccessArtifact = artifacts.readArtifactSync("RoleBasedAccess");

    fs.writeFileSync(
        path.join(contractsDir, "RoleBasedAccess.json"),
        JSON.stringify(RoleBasedAccessArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

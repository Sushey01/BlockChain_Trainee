const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const calculatorContract = await ethers.deployContract("Calculator");
    const contract_address = await calculatorContract.getAddress()
    console.log("Contract address:",contract_address)
    saveFrontendFiles(contract_address);

  }

   function saveFrontendFiles(contract_address) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "contracts");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ Calculator: contract_address }, undefined, 2)
    );
  
    const CalculatorArtifact = artifacts.readArtifactSync("Calculator");
  
    fs.writeFileSync(
      path.join(contractsDir, "Calculator.json"),
      JSON.stringify(CalculatorArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/SAhQY3WKGV3v5HNqPuM0Gi3NHNXyggyy";
const SEPOLIA_PRIVATE_KEY =
  "bccafc500ccf8e689dca31174d05272cf370efe5bc7c6d21ba19821a0c1057ab";

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};
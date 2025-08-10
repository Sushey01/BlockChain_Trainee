require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/UXC0Jv_YdMZYZ10TspY6f-ciA18NFxQ9";
const SEPOLIA_PRIVATE_KEY =
  "3ae8db9ad72b145b70f45170a5aff4f6b7215fbcf61a539cdc8466e383d267e1";
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

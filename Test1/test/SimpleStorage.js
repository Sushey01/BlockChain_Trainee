// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("SimpleStorage Contract", function() {
//   let SimpleStorage; // Contract factory
//   let simpleStorage; // Contract instance
//   let owner; // Deployer account

//   beforeEach(async function ( ){
//     //Get the deployer address
//     [owner] = await ethers.getSigners();

//     //Get the contract factory
//     SimpleStorage = await ethers.getContractFactory("SimpleStorage");

//     //Deploy the contract
//     simpleStorage = await SimpleStorage.deploy();
//   });

//   it("Should initialize with a value of 0", async function() {
//     const storedValue = await simpleStorage.get();
//     expect(storedValue).to.equal(0);
//   });

//   it("Should update the stored value when set() is called", async function () {
//     //Call the set function with a new value
//     const newValue = 42;
//     await simpleStorage.set(newValue);

//     //Retrieve the updated value
//     const storedValue = await simpleStorage.get();
//     console.log("storedValue:", storedValue);
//     expect(storedValue).to.equal(newValue);
    
//   });

//   //Similar to value check the value of string
//   it("Should update the stored string when setString() is called", async function () {
//     const newString = "Hello, World!";
//     // await simpleStorage.setString(newString);
//     const storedString = await simpleStorage.getString();

//     console.log("storedString:", storedString);
//     expect(await simpleStorage.getString()).to.equal("");


//     //retrieve the updated value
//     const storedValue = await simpleStorage.getString();
//     console.log("storedValue:", storedValue);
//     expect(storedValue).to.equal(newValue);
// });
// })
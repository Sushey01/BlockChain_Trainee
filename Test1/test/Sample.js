// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Sample Contract", function () {
//     let Sample;
//     let sample;
//     let owner;

//     beforeEach(async function () {
//         // Get the deployer's address
//         [owner] = await ethers.getSigners();

//         // Get the contract factory
//         Sample = await ethers.getContractFactory("Sample");

//         // Deploy the contract
//         sample = await Sample.deploy();
//     });

//     // Add your tests here
//     it("Should initialize name should be ram", async function () {
//         const storedValue = await sample.name();
//         expect(storedValue).to.equal("ram");
//     });

    
// it("Should initialize age should be 20", async function () {
//     const storedValue = await sample.age();
//     expect(storedValue).to.equal(20);
// });

// it("Should get deffault values", async function () {
//     const storedValue1 = await sample.age2();
//     const storedValue2 = await sample.gender();
//     const storedValue3 = await sample.incrementAge();

//     expect(storedValue1).to.equal(0);
//     expect (storedValue2).to.equal(1);
//     expect (storedValue3).to.equal(++1);
// });
// });


const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Contract", function () {
    let Sample;
    let sample;
    let owner;
    let addr1;

    beforeEach(async function () {
        // Get the deployer's address
        [owner, addr1] = await ethers.getSigners();

        // Get the contract factory
        Sample = await ethers.getContractFactory("Sample");

        // Deploy the contract
        sample = await Sample.deploy();
    });

    // Initialization Test Cases
    it("Should initialize name to 'ram'", async function () {
        const storedValue = await sample.name();
        expect(storedValue).to.equal("ram");
    });

    it("Should initialize gender to Female", async function () {
        const storedValue = await sample.gender();
        expect(storedValue).to.equal(1); // 0 for Male, 1 for Female
    });

    it("Should initialize age to 20", async function () {
        const storedValue = await sample.age();
        expect(storedValue).to.equal(20);
    });

    it("Should initialize age2 to 0", async function () {
        const storedValue = await sample.age2();
        expect(storedValue).to.equal(0);
    });

    // Functionality Test Cases
    it("Should return current age from getAge function", async function () {
        const storedValue = await sample.getAge();
        expect(storedValue).to.equal(20);
    });

    it("Should return current gender from getGender function", async function () {
        const storedValue = await sample.getGender();
        expect(storedValue).to.equal("female");
    });

    it("Should set user-defined age correctly", async function () {
        await sample.setUserDefinedAge(30);
        const storedValue = await sample.age();
        expect(storedValue).to.equal(30);
    });

    it("Should revert if age exceeds 120", async function () {
        await expect(sample.setUserDefinedAge(150)).to.be.revertedWith("Age cannot exceed 120.");
    });

    it("Should increment age correctly", async function () {
        await sample.incrementAge();
        const storedValue = await sample.age();
        expect(storedValue).to.equal(21);
    });

    it("Should increment age2 by 40", async function () {
        await sample.incrementAge2();
        const storedValue = await sample.age2();
        expect(storedValue).to.equal(40);
    });

    it("Should handle age2 overflow", async function () {
        for (let i = 0; i < 7; i++) {
            await sample.incrementAge2(); // Increment age2 multiple times
        }
        const storedValue = await sample.age2();
        expect(storedValue).to.equal(7); // Should wrap around
    });

    it("Should toggle gender correctly", async function () {
        await sample.changeGender();
        let storedValue = await sample.gender();
        expect(storedValue).to.equal(0); // should change to Male

        await sample.changeGender();
        storedValue = await sample.gender();
        expect(storedValue).to.equal(1); // should change back to Female
    });

    it("Should change name correctly", async function () {
        await sample.changeName("newName");
        const storedValue = await sample.name();
        expect(storedValue).to.equal("newName");
    });

    it("Should return 5 from pure function", async function () {
        const storedValue = await sample.purefunction();
        expect(storedValue).to.equal(5);
    });

    // Event Emission Tests
    it("Should emit AgeUpdated event when age is set", async function () {
        await expect(sample.setUserDefinedAge(30))
            .to.emit(sample, 'AgeUpdated')
            .withArgs(30);
    });

    it("Should emit GenderUpdated event when gender is changed", async function () {
        await expect(sample.changeGender())
            .to.emit(sample, 'GenderUpdated')
            .withArgs(0); // Should emit with new gender
    });

    it("Should emit NameChanged event when name is changed", async function () {
        await expect(sample.changeName("newName"))
            .to.emit(sample, 'NameChanged')
            .withArgs("newName");
    });

    // Access Control Test
    it("Should only allow owner to set user-defined age", async function () {
        await expect(sample.connect(addr1).setUserDefinedAge(30)).to.be.revertedWith("Not the contract owner");
    });
});
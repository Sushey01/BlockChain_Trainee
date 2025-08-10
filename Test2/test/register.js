const {expect} = require('chai');
const {ethers} = require('hardhat');

describe('Register', function () {
  let Register, register, owner, addr1, addr2;

  beforeEach(async function () {
    Register = await ethers.getContractFactory('Register');
    register = await Register.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });


//   1. Registering a New Student
// Task:
// Deploy the StudentRegistry contract.
// Use a signer (e.g., addr1) to call the registerStudent function with the name "Alice" and age 20.
// Verify that the student's name, age, and initial totalFeesPaid are correctly stored in the contract.
// Use the expect function to verify that the student's name is "Alice", age is 20, and totalFeesPaid is 0.

  it('Should register a new user', async function () {
    await register.connect(addr1).register('Alice', 20);

    const student = await register.students(addr1.address);
    expect(student.name).to.equal('Alice');
    expect(student.age).to.equal(20);
    expect(student.totalFeesPaid).to.equal(0);
  });

    // 2. Emitting StudentRegistered Event on Registration
    // Task:
    // Deploy the StudentRegistry contract.
    // Use a signer (e.g., addr1) to call the registerStudent function with the name "Bob" and age 25.
    // Verify that the StudentRegistered event is emitted with the correct address, name, and age as arguments.

  it("Should emit Register event on registration", async ()=> {
    await expect(register.connect(addr1).register("Bob", 25))
      .to.emit(register, "Register")
    .withArgs(addr1.address, "Bob", 25);
    }); 

    // 3. Preventing Duplicate Registration
    // Task:
    // Deploy the StudentRegistry contract.
    // Register the same student twice using the same signer (e.g., addr1).
    // Confirm that the second registration attempt fails with the error message "Student is already registered".

    it("Should prevent duplicate registeration", async ()=> {
      await Register.connect(addr1).register("Alice", 20);
      await expect(Register.connect(addr1).register("Alice", 20));
      to.be.revertedWith("Student is already registered");
    })

//     4. Paying Fees as a Registered Student
// Task:
// Deploy the StudentRegistry contract.
// Register a student using the signer (e.g., addr1).
// Use the same signer to call the payFees function with 1.0 ETH as payment.
// Verify that the totalFeesPaid for the student is updated correctly

it("Should pay fees as a registered student", asynv ()=> {
  await register.connect(addr1).register("alice", 30);
  await register.connect(addr1).payFees({value: ethers.parseEther("1.0")});
  const student = await register.students(addr1.address);
  expect(student.totalFeesPaid).to.equal(ethers.parseEther("1.0"));

});

//     5. Emitting FeePaid Event When Fees Are Paid
// Task:
// Deploy the StudentRegistry contract.
// Register a student using the signer (e.g., addr1).
// Call the payFees function with 0.5 ETH as payment.
// Verify that the FeePaid event is emitted with the correct address and payment amount as arguments.

it("Should emit FeePaid event when fees are paid", async ()=> {
  await register.connect(addr1).register("Alice", 20);
  await expect(register.connect(addr1).payFees)({value: ethers.parseEther("0.5")})
  .to.emit(register, "FeePaid")
  .withArgs(addr1.address, ethers.parseEther("0.5"));

})

// 6. Failing Fee Payment for Unregistered Students
// Task:
// Deploy the StudentRegistry contract.
// Use an unregistered signer (e.g., addr1) to call the payFees function with 1.0 ETH as payment.
// Confirm that the transaction reverts with the error message "You are not registered!".

it("Should fail fee payment for unregistered students", async ()=> {
  await expect(register.connect(addr1).payFees({value: ethers.parseEther("1.0")}))
  .to.be.revertedWith("You are not registered!");
})



// 7. Updating Student Details
// Task:
// Deploy the StudentRegistry contract.
// Register a student using the signer (e.g., addr1) with the name "Alice" and age 20.
// Call the updateStudent function to update the name to "AliceUpdated" and age to 21.
// Verify that the student's details are updated in the contract.





// 8. Emitting StudentUpdated Event on Update
// Task:
// Deploy the StudentRegistry contract.
// Register a student using the signer (e.g., addr1) with the name "Alice" and age 20.
// Call the updateStudent function to update the name to "AliceUpdated" and age to 21.
// Verify that the StudentUpdated event is emitted with the correct address, updated name, and updated age as arguments.

// 9. Returning All Registered Students
// Task:
// Deploy the StudentRegistry contract.
// Register two students using different signers (e.g., addr1 and addr2) with names "Alice" and "Bob" and ages 20 and 25, respectively.
// Call the getAllStudents function and verify that the returned list contains both students with their correct details.

});
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

contract StudentRegistry {
    struct Student {
        string name;
        uint256 age;
        address walletAddress;
        uint256 totalFeesPaid;
    }

    mapping(address => Student) public students;
    address[] public studentAddresses;

    event StudentRegistered(address indexed studentAddress, string name, uint256 age);
    event FeePaid(address indexed studentAddress, uint256 amount);
    event StudentUpdated(address indexed studentAddress, string name, uint256 age);

    modifier onlyRegistered() {
        require(bytes(students[msg.sender].name).length > 0, "You are not registered!");
        _;
    }

    function registerStudent(string calldata name, uint256 age) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0, "Age must be greater than zero");
        require(bytes(students[msg.sender].name).length == 0, "Student is already registered");

        students[msg.sender] = Student(name, age, msg.sender, 0);
        studentAddresses.push(msg.sender);

        emit StudentRegistered(msg.sender, name, age);
    }

    function payFees() external payable onlyRegistered {
        require(msg.value > 0, "Fee amount must be greater than zero");
        students[msg.sender].totalFeesPaid += msg.value;

        emit FeePaid(msg.sender, msg.value);
    }

    function updateStudent(string calldata name, uint256 age) external onlyRegistered {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0, "Age must be greater than zero");

        students[msg.sender].name = name;
        students[msg.sender].age = age;

        emit StudentUpdated(msg.sender, name, age);
    }

    function getAllStudents() external view returns (Student[] memory) {
        Student[] memory allStudents = new Student[](studentAddresses.length);

        for (uint256 i = 0; i < studentAddresses.length; i++) {
            allStudents[i] = students[studentAddresses[i]];
        }

        return allStudents;
    }
}
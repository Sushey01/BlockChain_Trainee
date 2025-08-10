// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator {
    uint256 public result;

    // Function to add numbers
    function add(uint256 a, uint256 b) public {
        result = a + b;
    }

    // Function to subtract numbers
    function subtract(uint256 a, uint256 b) public {
        require(a >= b, "Result would be negative");
        result = a - b;
    }

    // Function to multiply numbers
    function multiply(uint256 a, uint256 b) public {
        result = a * b;
    }

    // Function to divide numbers
    function divide(uint256 a, uint256 b) public {
        require(b > 0, "Cannot divide by zero");
        result = a / b;
    }

    // Function to get the result
    function getResult() public view returns (uint256) {
        return result;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage{
    uint private storedValue;
    string private storedString;

    function set(uint _value) public {
        storedValue = _value;
    }

    function setString(string memory _value) public {
        storedString = _value;
    }

    function get() public view returns(uint){
        return storedValue;
    }

    function getString() public view returns(string memory){
        return storedString;
    }
}
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Sample {

    string public name ="gita";
    enum Gender { Male, Female }
    Gender public gender;
    uint256 public age;
    uint8  public age2;

    constructor() {
        name = "ram";
        gender = Gender.Female;
        age = 20;
        // age2 = 20;
    }

      function getAge() public view returns (uint) {
        return age;
    }

    function getGender() public view returns (string memory) {
        return gender == Gender.Male ? "male" : "female";
    }

    function setUserDefinedAge(uint _age) public {
        age= _age;
    }

        function incrementAge2() public {
        age2 = age2 + 40;
    }

    function incrementAge() public {
        age = age + 1;
    }

    function purefunction() public pure returns(uint) {
        uint varl = 5;
        return varl;
    }

    function changeGender() public {
        gender = (gender == Gender.Male) ? Gender.Female : Gender.Male;
    }

    function changeName(string memory newName) public {
        name = newName;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address public winner_address;
    address[] public participants;

    constructor (){
        manager=msg.sender;
    }

    function enter() payable external{
        require(msg.value==0.01 ether, "The exact amount is 0.01");
        participants.push(msg.sender);
    }

    function random() private view returns(uint){
        return (uint (keccak256(abi.encodePacked(block.prevrandao, block.timestamp, participants))));
    }

    function pickWinner() public restricted {
        uint index = random() % participants.length;
        address winner = participants[index];
        winner_address = winner;
        payable(winner).transfer(address(this).balance);
        // Reset the participants array for the next lottery round
        participants = new address[](0);
    }

    modifier restricted(){
        require(msg.sender==manager,"Only the manager can call this function");
        _;
    }


    function getParticipants() public view returns(address[] memory) {
        return participants;
    }
}
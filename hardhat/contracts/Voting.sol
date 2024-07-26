// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Voting {
    //Create a structure for candidate info
    struct Candidate{
        uint256 id;
        string name;
        uint numberOfVotes;
    }
    //list of all candidates
    Candidate[] public candidates;
    
    //this will be owner address
    address public owner;
    
    //mapp all voters addresses
    mapping(address => bool) public voters;

    //list of voters
    address[] public listOfVoters;

    //voting start and end session
    uint256 public votingStart;
    uint256 public votingEnd;

    //voting status
    bool public electionStarted;

    //restrict creating election to owner only
    modifier onlyOwner(){
        require(msg.sender == owner, "you are not authorized to start the election");
        _;
    }

    //check if election is ongoing
    modifier electionOngoing(){
        require(electionStarted, "no election yet");
        _;
    }

    //create a constructor
    constructor(){
        owner = msg.sender;
    }

    //to start an election
    function startElection(string[] memory _candidates, uint256 _votingDuration) public onlyOwner {
        require(electionStarted == false, "Election Is Ongoing");
        delete candidates;
        resetAllVotersStatus();

        for(uint256 i=0; i < _candidates.length; i++){
            candidates.push(
                Candidate({id: i, name:_candidates[i], numberOfVotes:0})
            );
        }
        electionStarted= true;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_votingDuration * 1 minutes);
    }

    //to add new candidate
    function addCandidate(string memory _name) public onlyOwner electionOngoing{
       require(checkElectionPeriod(), "election period has ended");
       candidates.push(
        Candidate({id: candidates.length, name: _name, numberOfVotes: 0})
       );
    }

    //check voter status
       function voterStatus(address _voter) public view electionOngoing returns (bool){
        if(voters[_voter]==true){
            return true;
        }
        return false;
       }

       //to vote function
       function voteTo(uint256 _id) public electionOngoing{
        require(checkElectionPeriod(), "elecrion has ended");
        require(!voterStatus(msg.sender), "you already voted");
        candidates[_id].numberOfVotes++;
        voters[msg.sender] = true;
        listOfVoters.push(msg.sender);
       }

       //get no of votes
       function retrieveVotes() public view returns(Candidate[] memory){
        return candidates;
       }

       //monitor election time
       function electionTimer() public view electionOngoing returns(uint256){
        if(block.timestamp >= votingEnd){
            return 0;
        }
        return (votingEnd - block.timestamp);
       }

       //check if election period is ongoing
       function checkElectionPeriod() public returns (bool){
        if(electionTimer() > 0){
            return true;
        }
        electionStarted = false;
        return false;
       }

       //reset all voters status
       function resetAllVotersStatus() public onlyOwner{
        for(uint256 i=0; i < listOfVoters.length; i++){
            voters[listOfVoters[i]] = false;
        }
        delete listOfVoters;

       }
}

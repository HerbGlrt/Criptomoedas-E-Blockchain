// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    uint public startTime;
    uint public endTime;
    bool public votingClosed;

    event Voted(address indexed voter, uint indexed candidateId);
    event VotingClosed(uint timestamp);
    event CandidateAdded(string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier votingOpen() {
        require(block.timestamp >= startTime, "Voting has not started");
        require(block.timestamp <= endTime, "Voting has ended");
        require(!votingClosed, "Voting is closed");
        _;
    }

    modifier votingNotStarted() {
        require(block.timestamp < startTime, "Voting already started");
        _;
    }

    constructor(uint _startTime, uint _endTime) {
        require(_endTime > _startTime, "End time must be after start time");
        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
        votingClosed = false;
    }

    function addCandidate(string memory name) public onlyOwner votingNotStarted {
        candidates.push(Candidate({name: name, voteCount: 0}));
        emit CandidateAdded(name);
    }

    function vote(uint candidateId) public votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");
        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;
        emit Voted(msg.sender, candidateId);
    }

    function closeVoting() public onlyOwner {
        require(!votingClosed, "Voting already closed");
        require(block.timestamp > endTime, "Voting period not ended");
        votingClosed = true;
        emit VotingClosed(block.timestamp);
    }

    function getCandidates() public view returns (string[] memory, uint[] memory) {
        string[] memory names = new string[](candidates.length);
        uint[] memory votes = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
            votes[i] = candidates[i].voteCount;
        }
        return (names, votes);
    }

    function getWinner() public view returns (string memory winnerName, uint winnerVotes) {
        require(votingClosed, "Voting not closed yet");
        uint maxVotes = 0;
        uint winnerIndex = 0;
        bool tie = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
                tie = false;
            } else if (candidates[i].voteCount == maxVotes && maxVotes != 0) {
                tie = true;
            }
        }
        if (tie) {
            return ("Empate", maxVotes);
        }
        return (candidates[winnerIndex].name, maxVotes);
    }
}

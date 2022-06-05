// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "./utils/SafeMath.sol";
import "./utils/Ownable.sol";
import "./ERC20Token.sol";
import "./Role/Governable.sol";
import "./security/ReentrancyGuard.sol";

contract Agreement is Governable, ReentrancyGuard {
    using SafeMath for uint256;

    event TokenCreated(address tokenAddress);
    event VoteCasted(address voter);
    event Unlocked();
    event ProfitRateChanged(uint256 newRate);
    event DeadlineChanged(uint256 newDeadline);

    ERC20Token public token;
    IERC20 public stableCoin;
    uint256 public quorum;
    uint256 public votes;
    uint256 public deadline;
    uint256 public maxDelay;
    uint256 public votingStartDate;
    uint256 public profitRate = 1000000;
    bool public locked = true;
    mapping(address => bool) public hasVoted;


    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address deployer,
        uint256 _quorum,
        address[] memory _operators,
        uint256 _maxDelay,
        uint256 _minLockDuration,
        address _stableCoin
    ) {
        require(_quorum > 0, "Agreement: number of needed witnesses must be greater than zero");
        require(_quorum <= _operators.length, "Agreement: quorum must be less than or equal to number of operators");

        token = new ERC20Token(
            name,
            symbol,
            18,
            initialSupply,
            deployer
        );

        stableCoin = IERC20(address(_stableCoin));
        quorum = _quorum;
        maxDelay = _maxDelay;
        for (uint i = 0; i < _operators.length; i++)
            _addOperator(_operators[i]);

        votingStartDate = block.timestamp.add(_minLockDuration.mul(1 days));

        transferOwnership(deployer);
        emit TokenCreated(address(token));
    }

    function castVote() public onlyOperator {
        require(hasVoted[msg.sender] == false, "Agreement: already voted");
        require(locked == true, "Agreement: tokens are already unlocked");
        require(block.timestamp >= votingStartDate, "Agreement: voting is not started yet");

        emit VoteCasted(msg.sender);
        hasVoted[msg.sender] = true;
        votes++;

        if (votes >= quorum) {
            locked = false;
            deadline = block.timestamp.add(maxDelay.mul(1 days));
            emit Unlocked();
        }
    }

    function receiveProfit(address _to) public nonReentrant {
        require(locked == false, "Agreement: project is not finished yet");
        require(block.timestamp <= deadline, "Agreement: project deadline is passed");

        uint256 balance = token.balanceOf(msg.sender);
        token.transferFrom(msg.sender, address(this), balance);
        stableCoin.transfer(_to, balance.mul(profitRate).div(1000000));
    }

    function setProfitRate (uint256 rate) public onlyOwner () {
        require(rate >= 1000000, "Agreement: rate / 1000000 must be at least equal to one");
        profitRate = rate;
        emit ProfitRateChanged(rate);
    }

    function increaseDeadline (uint256 delayTimeInDays) public onlyOwner () {
        require(locked == false, "Agreement: project is not finished yet");
        deadline = deadline.add(delayTimeInDays.mul(1 days));
        emit DeadlineChanged(deadline);
    }

    function discharge (address _to) public onlyOwner () {
        require(locked == false, "Agreement: project is not finished yet");
        require(block.timestamp > deadline, "Agreement: project deadline is not passed yet");
        uint256 balance = stableCoin.balanceOf(address(this));
        stableCoin.transfer(_to, balance);
    }
}
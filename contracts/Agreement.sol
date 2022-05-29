// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20Token.sol";
import "./Role/Governable.sol";

contract Agreement is Governable {
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
    uint256 public profitRate = 10000;
    bool public locked = true;
    mapping(address => bool) public hasVoted;


    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        address deployer,
        uint256 _quorum,
        address[] memory _operators,
        uint256 _maxDelay,
        address _stableCoin
    ) {
        require(_quorum > 0, "Agreement: number of needed witnesses must be greater than zero");
        require(_quorum <= _operators.length, "Agreement: quorum must be less than or equal to number of operators");

        token = new ERC20Token(
            name,
            symbol,
            decimals,
            initialSupply,
            deployer
        );

        stableCoin = IERC20(address(_stableCoin));
        quorum = _quorum;
        maxDelay = _maxDelay;
        for (uint i = 0; i < _operators.length; i++)
            _addOperator(_operators[i]);

        transferOwnership(deployer);
        emit TokenCreated(address(token));
    }

    function castVote() public onlyOperator {
        require(hasVoted[msg.sender] == false, "Agreement: already voted");
        require(locked == true, "Agreement: tokens are already unlocked");

        emit VoteCasted(msg.sender);
        hasVoted[msg.sender] = true;
        votes++;

        if (votes >= quorum) {
            locked = false;
            deadline = block.timestamp + (maxDelay * 1 days);
            emit Unlocked();
        }
    }

    function receiveProfit(address _to) public {
        require(locked == false, "Agreement: project is not finished yet");
        require(block.timestamp <= deadline, "Agreement: project deadline is passed");

        uint256 balance = token.balanceOf(msg.sender);
        token.transferFrom(msg.sender, address(this), balance);
        stableCoin.transfer(_to, balance.mul(profitRate).div(10000));
    }

    function setProfitRate (uint256 rate) public onlyOwner () {
        require(rate >= 10000, "Agreement: rate / 10000 must be at least equal to one");
        profitRate = rate;
        emit ProfitRateChanged(rate);
    }

    function increaseDeadline (uint256 delayTimeInDays) public onlyOwner () {
        require(locked == false, "Agreement: project is not finished yet");
        deadline += (delayTimeInDays * 1 days);
        emit DeadlineChanged(deadline);
    }

    function discharge (address _to) public onlyOwner () {
        require(locked == false, "Agreement: project is not finished yet");
        require(block.timestamp > deadline, "Agreement: project deadline is not passed yet");
        uint256 balance = stableCoin.balanceOf(address(this));
        stableCoin.transfer(_to, balance);
    }
}
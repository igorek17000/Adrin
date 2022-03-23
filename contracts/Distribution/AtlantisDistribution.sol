// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./DistributorERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
  
contract AtlantisTokenWithDistribution is DistributorERC20, Ownable {
    // ordinary users (OU) lvl 0
    // shareholders (SH) lvl 1 and 2 (lvl 2s are founder)

    using SafeMath for uint256;
    // fund wallet for regular shareholders
    address payable public fund_wallet;

    constructor(string memory name, string memory symbol, address payable _fund_wallet, uint256 _initialSupply) DistributorERC20(name, symbol) {
        totalLevelSupply[0] = _initialSupply;
        totalLevelSupply[1] = 0;
        totalLevelSupply[2] = 0;

        currentBC[0] = 10**uint(decimals() * 2);
        currentBC[1] = 10**uint(decimals() * 2);
        currentBC[2] = 10**uint(decimals() * 2);

        _mint(_msgSender(), _initialSupply);
        fund_wallet = _fund_wallet;
    }

    function _mintAndDistribute(uint256 amount) internal {

        require(
            amount > 0,
            "Distribution: zero amount"
        );
        require(totalLevelSupply[1] > 0, "Distribution: total supply of VIP level one is zero");
        require(totalLevelSupply[2] > 0, "Distribution: total supply of VIP level two is zero");

        if (totalLevelSupply[2] != 0) {
            currentBC[2] = currentBC[2].mul((totalLevelSupply[2].add(amount.div(4))));
            currentBC[2] = currentBC[2].div(totalLevelSupply[2]);
        }
        if (totalLevelSupply[1] != 0) {
            currentBC[1] = currentBC[1].mul((totalLevelSupply[1].add(amount.div(4))));
            currentBC[1] = currentBC[1].div(totalLevelSupply[1]);
        }
      
        _balances[fund_wallet] = _balances[fund_wallet].add(amount.div(2));
        totalLevelSupply[0] = totalLevelSupply[0].add(amount.div(2));
        totalLevelSupply[1] = totalLevelSupply[1].add(amount.div(4));
        totalLevelSupply[2] = totalLevelSupply[2].add(amount.div(4)); 
        _totalSupply = _totalSupply.add(amount);
    }

    function _changeLevel(address account, uint8 newLvl) internal {
        require(
            account != address(0),
            "Distribution: can not change zero address level"
        );

        require(
            account != fund_wallet,
            "Distribution: can not change fund address level"
        );

        require(
            newLvl < 3,
            "Distribution: level exceeds"
        );

        relaxBalance(account);
        uint8 oldLvl = levels[account];
        levels[account] = newLvl;
        totalLevelSupply[oldLvl] = totalLevelSupply[oldLvl].sub(_balances[account]);
        totalLevelSupply[newLvl] = totalLevelSupply[newLvl].add(_balances[account]);
        balanceCoefficients[account] = currentBC[newLvl];
    }

    function _mintForVIP(address account, uint256 amount) internal {
        require(levels[account] != 0, "Distribution: account is not VIP");
        require(totalLevelSupply[1] > 0, "Distribution: total supply of VIP level one is zero");
        require(totalLevelSupply[2] > 0, "Distribution: total supply of VIP level two is zero");

        relaxBalance(account);
        _balances[account] = _balances[account].add(amount);
        _balances[fund_wallet] = _balances[fund_wallet].add(amount.mul(2));

        uint8 other = 3 - levels[account];
        currentBC[other] = currentBC[other].mul((totalLevelSupply[other].add(amount)));
        currentBC[other] = currentBC[other].div(totalLevelSupply[other]);

        totalLevelSupply[0] = totalLevelSupply[0].add(amount.mul(2));
        totalLevelSupply[1] = totalLevelSupply[1].add(amount);
        totalLevelSupply[2] = totalLevelSupply[2].add(amount); 

        _totalSupply = _totalSupply.add(amount.mul(4));
    }

    function _mintForNormal(address account, uint256 amount) internal {
        require(levels[account] == 0, "Distribution: account is not normal");
        require(totalLevelSupply[1] > 0, "Distribution: total supply of VIP level one is zero");
        require(totalLevelSupply[2] > 0, "Distribution: total supply of VIP level two is zero");

        _balances[account] = _balances[account].add(amount);
        totalLevelSupply[0].add(amount);

        for (uint8 i = 1; i <= 2; i++) {
            currentBC[i] = currentBC[i].mul((totalLevelSupply[i].add(amount.div(2))));
            currentBC[i] = currentBC[i].div(totalLevelSupply[i]);
            totalLevelSupply[i] = totalLevelSupply[i].add(amount.div(2));
        }
        _totalSupply = _totalSupply.add(amount.mul(2));
    }
}


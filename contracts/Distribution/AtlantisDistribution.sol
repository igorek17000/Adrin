// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./EnhancedERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
  
contract AtlantisDistribution is ERC20, Ownable {
    // ordinary users (OU) lvl 0
    // shareholders (SH) lvl 1 and 2 (lvl 2s are founder)

    using SafeMath for uint256;
    // fund wallet for regular shareholders
    address payable public fund_wallet;

    constructor(string memory name, string memory symbol, address payable _fund_wallet) ERC20(name, symbol) {
        totalLevelSupply[0] = 300000000 * 10**uint(decimals());
        totalLevelSupply[1] = 0;
        totalLevelSupply[2] = 0;

        currentBC[0] = 10**uint(decimals() * 2);
        currentBC[1] = 10**uint(decimals() * 2);
        currentBC[2] = 10**uint(decimals() * 2);

        _mint(msg.sender, 300000000 * 10**uint(decimals()));
        fund_wallet = _fund_wallet;
    }

    function mint(uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        if (totalLevelSupply[2] != 0) {
            currentBC[2] = currentBC[2].mul((totalLevelSupply[2].add(amount.div(4))));
            currentBC[2] = currentBC[2].div(totalLevelSupply[2]);
        }
        if (totalLevelSupply[1] != 0) {
            currentBC[1] = currentBC[1].mul((totalLevelSupply[1].add(amount.div(4))));
            currentBC[1] = currentBC[1].div(totalLevelSupply[1]);
        }
        // found wallet must have level 0
        _balances[fund_wallet] = _balances[fund_wallet].add(amount.div(2));
        totalLevelSupply[0] = totalLevelSupply[0].add(amount.div(2));
        totalLevelSupply[1] = totalLevelSupply[1].add(amount.div(4));
        totalLevelSupply[2] = totalLevelSupply[2].add(amount.div(4)); 
        _totalSupply = _totalSupply.add(amount);
    }

    function changeLvl(address account, uint8 newLvl) external onlyOwner {
        relaxBalance(account);
        uint8 oldLvl = level[account];
        level[account] = newLvl;
        totalLevelSupply[oldLvl] = totalLevelSupply[oldLvl].sub(_balances[account]);
        totalLevelSupply[newLvl] = totalLevelSupply[newLvl].add(_balances[account]);
        balanceCoefficient[account] = currentBC[newLvl];
    }

    function mintToNRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(level[account] != 0, "account is a regular shareholder");
        relaxBalance(account);
        _balances[account] = _balances[account].add(amount);
        _balances[fund_wallet] = _balances[fund_wallet].add(amount.mul(2));

        uint8 other = 3 - level[account];
        currentBC[other] = currentBC[other].mul((totalLevelSupply[other].add(amount)));
        currentBC[other] = currentBC[other].div(totalLevelSupply[other]);

        totalLevelSupply[0] = totalLevelSupply[0].add(amount.mul(2));
        totalLevelSupply[1] = totalLevelSupply[1].add(amount);
        totalLevelSupply[2] = totalLevelSupply[2].add(amount); 

        _totalSupply = _totalSupply.add(amount.mul(4));
    }

    function mintToRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(level[account] == 0, "account is not a regular shareholder");
        _balances[account] = _balances[account].add(amount);
        totalLevelSupply[0].add(amount);

        for (uint8 i = 1; i <= 2; i++) {
            currentBC[i] = currentBC[i].mul((totalLevelSupply[i].add(amount.div(2))));
            currentBC[i] = currentBC[i].div(totalLevelSupply[i]);
            totalLevelSupply[i] = totalLevelSupply[i].add(amount.div(2));
        }
        _totalSupply = _totalSupply.add(amount.mul(2));
    }

    function burn(uint256 _amount) external {
        _burn(_msgSender(), _amount);
    }

}


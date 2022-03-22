// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./EnhancedERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
  
contract AtlantisDistribution is ERC20, Ownable {
    // ordinary users (OU) lvl 0
    // shareholders (SH) lvl 1 and 2 (lvl 2s are founder)

    //TODO enum(?)

    using SafeMath for uint256;
    // BC is balance coefficient of last time an address relaxed
    mapping (address => uint256) private balanceCoefficient;
    // lvl of address could be 0,1,2 as explained before
    mapping (address => uint8) public level;
    //TODO public or private
    uint8 constant size = 3;
    // currentBC is current balance coefficient for every lvl
    uint256[size] currentBC;
    // total balance of each lvl
    uint256[size] totalLevelSupply;
    // fund wallet for regular shareholders
    address payable public fund_wallet;

    constructor(string memory name, string memory symbol, address payable _fund_wallet) ERC20(name, symbol) {
        _mint(msg.sender, 300000000 * 10**uint(decimals()));
        currentBC[0] = 10**uint(decimals() * 2);
        currentBC[1] = 10**uint(decimals() * 2);
        currentBC[2] = 10**uint(decimals() * 2);
        totalLevelSupply[0] = 300000000 * 10**uint(decimals());
        totalLevelSupply[1] = 0;
        totalLevelSupply[2] = 0;
        fund_wallet = _fund_wallet;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (level[account] == 0)
            return _balances[account];
        return (
            // FIXME: first time the balanceCoefficient of an account is 0
            currentBC[level[account]].mul(_balances[account])).div(balanceCoefficient[account]
            );
    }

    function relaxBalance(address account) internal {
        if (level[account] == 0)
            return;
        _balances[account] = (currentBC[level[account]].mul(_balances[account])).div(balanceCoefficient[account]);
        balanceCoefficient[account] = currentBC[level[account]];
    }

    function mint(uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        if (totalLevelSupply[2] != 0) {
            currentBC[2] = currentBC[2].mul((totalLevelSupply[2] + amount.div(4)));
            currentBC[2] = currentBC[2].div(totalLevelSupply[2]);
        }
        if (totalLevelSupply[1] != 0) {
            currentBC[1] = currentBC[1].mul((totalLevelSupply[1] + amount.div(4)));
            currentBC[1] = currentBC[1].div(totalLevelSupply[1]);
        }
        // FIXME: use safe math for the following operations
        // TODO: also add the newly minted token to totalLevelSupply[0]
        _balances[fund_wallet] += amount.div(2);
        totalLevelSupply[1] += amount.div(4);
        totalLevelSupply[2] += amount.div(4); 
        _totalSupply += amount;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // beforeTransferFunction start
        address sender = _msgSender();
        relaxBalance(sender);
        relaxBalance(recipient);
        totalLevelSupply[level[sender]] -= amount;
        totalLevelSupply[level[recipient]] += amount;
        // beforeTransferFuncion end
        _transfer(sender, recipient, amount);
        return true;
    }

    function changeLvl(address account, uint8 newLvl) external onlyOwner {
        relaxBalance(account);
        uint8 oldLvl = level[account];
        level[account] = newLvl;
        // FIXME: use safe math
        totalLevelSupply[oldLvl] -= _balances[account];
        totalLevelSupply[newLvl] += _balances[account];
        balanceCoefficient[account] = currentBC[newLvl];
    }

    function mintToNRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(level[account] != 0, "account is a regular shareholder");
        relaxBalance(account);
        // FIXME: use safe math
        _balances[account] += amount;
        _balances[fund_wallet] += amount.mul(2);

        uint8 other = 3 - level[account];
        currentBC[other] = currentBC[other].mul((totalLevelSupply[other] + amount));
        currentBC[other] = currentBC[other].div(totalLevelSupply[other]);

        // FIXME: use safe math
        totalLevelSupply[1] += amount;
        totalLevelSupply[2] += amount; 
        _totalSupply += amount;
    }

    function mintToRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(level[account] == 0, "account is not a regular shareholder");
        // FIXME: use safe math 
        _balances[account] += amount;
        for (uint8 i = 1; i <= 2; i++) {
            currentBC[i] = currentBC[i].mul((totalLevelSupply[i] + amount.div(2)));
            currentBC[i] = currentBC[i].div(totalLevelSupply[i]);

            // FIXME: use safe math 
            totalLevelSupply[i] += amount.div(2);
        }
        _totalSupply += amount;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
    
        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");

        // beforeTransferFunction start
        relaxBalance(sender);
        relaxBalance(recipient);

        // FIXME: use safe math 
        totalLevelSupply[level[sender]] -= amount;
        totalLevelSupply[level[recipient]] += amount;
        // beforeTransferFuncion end
        _transfer(sender, recipient, amount);

        _approve(sender, _msgSender(), currentAllowance - amount);
        
        return true;
    }
}


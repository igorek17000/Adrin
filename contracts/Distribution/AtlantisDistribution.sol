// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./WrappedERC20Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
  
contract AtlantisDistribution is ERC20, Ownable {
    // regular shareholder (RS) lvl 0
    // non regular shareholder (NRS) lvl 1 and 2 (lvl 2s are founder)

    //TODO enum(?)

    using SafeMath for uint256;
    // BC is balance coefficient of last time an address relaxed
    mapping (address => uint256) BC;
    // lvl of address could be 0,1,2 as explained before
    mapping (address => uint8) public lvl;
    uint8 constant size = 3;
    // currentBC is current balance coefficient for every lvl
    uint256[size] currentBC;
    // total balance of each lvl
    uint256[size] total;
    // fund wallet for regular shareholders
    address payable public fund_wallet;

    constructor(string memory name, string memory symbol, address payable _fund_wallet) ERC20(name, symbol) {
        _mint(msg.sender, 300000000 * 10**uint(decimals()));
        currentBC[0] = 10**uint(decimals());
        currentBC[1] = 10**uint(decimals());
        currentBC[2] = 10**uint(decimals());
        total[0] = 300000000 * 10**uint(decimals());
        total[1] = 0;
        total[2] = 0;
        fund_wallet = _fund_wallet;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (lvl[account] == 0)
            return _balances[account];
        return (currentBC[lvl[account]].mul(_balances[account])).div(BC[account]);
    }

    function relaxBalance(address account) internal {
        if (lvl[account] == 0)
            return;
        _balances[account] = (currentBC[lvl[account]].mul(_balances[account])).div(BC[account]);
        BC[account] = currentBC[lvl[account]];
    }

    function mint(uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        if (total[2] != 0) {
            currentBC[2] = currentBC[2].mul((total[2] + amount.div(4)));
            currentBC[2] = currentBC[2].div(total[2]);
        }
        if (total[1] != 0) {
            currentBC[1] = currentBC[1].mul((total[1] + amount.div(4)));
            currentBC[1] = currentBC[1].div(total[1]);
        }
        _balances[fund_wallet] += amount.div(2);
        total[1] += amount.div(4);
        total[2] += amount.div(4); 
        _totalSupply += amount;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // beforeTransferFunction start
        address sender = _msgSender();
        relaxBalance(sender);
        relaxBalance(recipient);
        total[lvl[sender]] -= amount;
        total[lvl[recipient]] += amount;
        // beforeTransferFuncion end
        _transfer(sender, recipient, amount);
        return true;
    }

    function changeLvl(address account, uint8 newLvl) external onlyOwner {
        relaxBalance(account);
        uint8 oldLvl = lvl[account];
        lvl[account] = newLvl;
        total[oldLvl] -= _balances[account];
        total[newLvl] += _balances[account];
        BC[account] = currentBC[newLvl];
    }

    function mintToNRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(lvl[account] != 0, "account is a regular shareholder");
        relaxBalance(account);
        _balances[account] += amount;
        _balances[fund_wallet] += amount.mul(2);

        uint8 other = 1 - lvl[account];
        currentBC[other] = currentBC[other].mul((total[other] + amount));
        currentBC[other] = currentBC[other].div(total[other]);
        total[1] += amount;
        total[2] += amount; 
        _totalSupply += amount;
    }

    function mintToRS(address account, uint256 amount) external onlyOwner {
        // at least one address with positive balance must have lvl 1 and 2, if not code does not crash but some tokens will be locked
        require(lvl[account] == 0, "account is not a regular shareholder");
        _balances[account] += amount;
        for (uint8 i = 1; i <= 2; i++) {
            currentBC[i] = currentBC[i].mul((total[i] + amount.div(2)));
            currentBC[i] = currentBC[i].div(total[i]);
            total[i] += amount.div(2);
        }
        _totalSupply += amount;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        //TODO
        return true;
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./WrappedERC20Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
  
contract AtlantisDistribution is ERC20, Ownable {
    //TODO enum
    using SafeMath for uint256;
    mapping (address => uint256) y;
    mapping (address => uint8) public lvl;
    uint size = 3;
    uint256[] public cury = new uint256[](size);
    uint256[] total = new uint256[](size);
    address payable fund_wallet;

    constructor(string memory name, string memory symbol, address payable _fund_wallet) ERC20(name, symbol) {
        _mint(msg.sender, 300000000 * 10**uint(decimals()));
        cury[0] = 10**uint(decimals());
        cury[1] = 10**uint(decimals());
        cury[2] = 10**uint(decimals());
        total[0] = 300000000 * 10**uint(decimals());
        fund_wallet = _fund_wallet;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (lvl[account] == 0)
            return _balances[account];
        return cury[lvl[account]] * _balances[account] / y[account];
    }

    function relaxBalance(address account) public {
        if (lvl[account] == 0)
            return;
        _balances[account] = cury[lvl[account]] * _balances[account] / y[account];
        y[account] = cury[lvl[account]];
    }

    function mint(uint256 amount) external onlyOwner {
        if (total[2] != 0) {
            cury[2] *= (total[2] + amount / 4);
            cury[2] /=  total[2];
        }
        if (total[1] != 0) {
            cury[1] *= (total[1] + amount / 4);
            cury[1] /= total[1];
        }
        _balances[fund_wallet] += amount / 2;
        total[1] += amount / 4;
        total[2] += amount / 4; 
        _totalSupply += amount;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        address sender = _msgSender();
        relaxBalance(sender);
        relaxBalance(recipient);
        total[lvl[sender]] -= amount;
        total[lvl[recipient]] += amount;
        _transfer(sender, recipient, amount);
        return true;
    }

    function changeLvl(address account, uint8 newLvl) external onlyOwner {
        relaxBalance(account);
        uint8 oldLvl = lvl[account];
        lvl[account] = newLvl;
        total[oldLvl] -= _balances[account];
        total[newLvl] += _balances[account];
        y[account] = cury[newLvl];
    }

    function mintToNRS(address account, uint256 amount) external onlyOwner {
        require(lvl[account] != 0, "account is a regular shareholder");
        relaxBalance(account);
        _balances[account] += amount;
        _balances[fund_wallet] += 2 * amount;

        uint8 other = 1 - lvl[account];
        cury[other] *= (total[other] + amount);
        cury[other] /= total[other];
        total[1] += amount;
        total[2] += amount; 
        _totalSupply += amount;
    }

    function mintToRS(address account, uint256 amount) external onlyOwner {
        require(lvl[account] == 0, "account is not a regular shareholder");
        _balances[account] += amount;
        for (uint8 i = 1; i <= 2; i++) {
            cury[i] *= (total[i] + amount / 2);
            cury[i] /= total[i];
            total[i] += amount / 2;
        }
        _totalSupply += amount;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        //TODO
        return true;
    }
}


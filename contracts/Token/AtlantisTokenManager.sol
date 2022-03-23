// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./AtlantisToken.sol";
import "../Role/Roles.sol";

contract TotemTokenManager is Context, Ownable {

    AtlantisPayToken atlantisPayToken;

    using Roles for Roles.Role;

    Roles.Role private _managers;

    event ManagerAdded(address indexed account);
    event ManagerRemoved(address indexed account);

    constructor(AtlantisPayToken _atlantisToken) {
        if (!isManager(_msgSender())) {
            _addManager(_msgSender());
        }

        atlantisPayToken = _atlantisToken;
    }

    modifier onlyManager() {
        require(
            isManager(_msgSender()),
            "0100 caller does not have the Manager role"
        );
        _;
    }

    function isManager(address account) public view returns (bool) {
        return _managers.has(account);
    }

    function addManager(address account) public onlyOwner {
        _addManager(account);
    }

    function removeManager(address account) public onlyOwner {
        _removeManager(account);
    }

    function renounceManager() public {
        _removeManager(_msgSender());
    }

    function _addManager(address account) internal {
        _managers.add(account);
        emit ManagerAdded(account);
    }

    function _removeManager(address account) internal {
        _managers.remove(account);
        emit ManagerRemoved(account);
    }

   
    function renounceOwnership() public override onlyOwner {
        // renounceOwnership is over written and do nothing
    }

    function atlantisTokenTransferOwnership(address newOwner) public onlyOwner {
        atlantisPayToken.transferOwnership(newOwner);
    }

    // function mint(address _to, uint256 _amount) external onlyManager returns (bool) {
    //     return atlantisPayToken.mint(_to, _amount);
    // }

    function configureMinter(address minter, uint256 minterAllowedAmount)
        external
        onlyManager
        returns (bool)
    {
        return atlantisPayToken.configureMinter(minter, minterAllowedAmount);
    }

    function removeMinter(address minter)
        external
        onlyManager
        returns (bool)
    {
        return atlantisPayToken.removeMinter(minter);
    }

    function burn(uint256 _amount)
        external
        onlyManager
    {
        atlantisPayToken.burn(_amount);
    }

    function updateMasterMinter(address _newMasterMinter) external onlyManager {
        atlantisPayToken.updateMasterMinter(_newMasterMinter);
    }

}
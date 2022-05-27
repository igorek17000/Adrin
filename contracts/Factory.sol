// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "./Agreement.sol";
import "./Role/Governable.sol";

contract Factory is Governable {
    event AgreementCreated(address agreementAddress);

    function deployNewAgreement(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 quorum,
        address[] memory voters,
        uint256 maxDelay,
        address stableCoinAddress
    ) public onlyOperator returns (address)  {
        Agreement t = new Agreement(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender,
            quorum,
            voters,
            maxDelay,
            stableCoinAddress
        );
        emit AgreementCreated(address(t));

        return address(t);
    }

    function addOperator (address account) public onlyOwner {
         _addOperator(account);
    }

    function removeOperator (address account) public onlyOwner {
         _removeOperator(account);
    }
}
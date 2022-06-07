// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

interface IFactory {

    /**
     * @dev Emitted when new agreement with address `agreementAddress` is created
     */
     
    event AgreementCreated(address agreementAddress);

    /**
     * @dev operator can build new agreement contract
     */

    function deployNewAgreement(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply,
        uint256 quorum,
        address[] memory voters,
        uint256 maxDelay,
        uint256 minLockDuration,
        address stableCoinAddress
    ) external returns (address);

    /**
    * @dev owner can add new operator 
    */

    function addOperator (address account) external;

    /**
     * @dev owner can remove an operator 
     */
    function removeOperator (address account) external;
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

interface IAgreement {

    /**
     * @dev Emitted when new token with address `tokenAddress` is created
     */
     
    event TokenCreated(address tokenAddress);

    /**
     * @dev Emitted when recieving profit is usable for users,
     * More precisely emitted first time that the number of votes is greater than or equal to quorum 
     */

    event Unlocked();

    /**
     * @dev Emitted when a voter vote with argument equal to voter address
     */

    event VoteCasted(address voter);

    /**
     * @dev Emitted when owner change profit rate with argument equal to new rate
     */

    event ProfitRateChanged(uint256 newRate);

     /**
     * @dev Emitted when owner increase deadline with argument equal to new deadline
     */ 
    event DeadlineChanged(uint256 newDeadline);

    /**
     * @dev operators vote for the completion of the project when voting time starts
     * if number of voters exceed the quorum, recieve profit will be unlocked
     */
    function castVote() external;

    /**
     * @dev users can recieve their profit after the completion 
     * of the project and before the deadline comes up
     * the profit will be the multiple of user's token balance and profit rate
     */
    function recieveProfit(address _to) external;

    /**
     * @dev owner can change the profit rate to a number greater than 1 * 10000
     * for changing the rate to x, must call the function with x * 10000
     */
    function setProfitRate (uint256 rate) external;

    /**
     * @dev owner can increase deadline for some number of days
     */
    function increaseDeadline (uint256 delayTimeInDays) external;

    /**
     * @dev when the deadline time comes up, owner can transfer extra stable tokens to intended address
     */
    function discharge (address _to) external;
}

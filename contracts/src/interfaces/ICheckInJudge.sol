// SPDX-License_Identifier: MIT
pragma solidity 0.8.25;

/**
 * @title ICheckInJudge
 * @notice This is an optional interface for challenges to use a custom check-in judge.
 * @dev It should do custom checks in addition to tha main tracker checks. Some examples are:
 * - Check if the checkInData is already used.
 */
interface ICheckInJudge {

    /**
     * @notice The custom checkin judge should implement this function.
     * @param checkInData any data that the judge needs to verify the check-in.
     */
    function judge(bytes memory checkInData) external returns (bool);
}

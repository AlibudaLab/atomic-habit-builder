// SPDX-License_Identifier: MIT
pragma solidity 0.8.25;

interface ICheckInJudge {
    function judge(bytes memory checkInData) external returns (bool);
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./mock/MockERC20.sol";
import "../src/Challenges.sol";
import "../src/interfaces/IChallenges.sol";

contract ChallengesTest is Test {
    MockERC20 stakingAsset;
    Challenges challenges;
    address verifier;
    address treasury;
    uint256 key;
    uint64 joinDueDays;
    uint64 challengeEndDays;
    uint128 constant PER_USER_STAKE = 100 * 1e6;

    function setUp() public {
        challengeEndDays = 100;
        joinDueDays = 1;

        stakingAsset = new MockERC20("USDC", "USDC", 6);
        challenges = new Challenges("Alibuda Habit Builder", "1.0");

        (verifier, key) = makeAddrAndKey("test_verifier");
        treasury = makeAddr("treasury");
        challenges.create(
            IChallenges.Challenge(
                verifier,
                1,
                uint64(block.timestamp),
                uint64(block.timestamp + joinDueDays * 1 days),
                uint64(block.timestamp + challengeEndDays * 1 days),
                treasury,
                6_000,
                address(0),
                address(stakingAsset),
                PER_USER_STAKE
            )
        );

        stakingAsset.mint(address(this), PER_USER_STAKE);
        stakingAsset.approve(address(challenges), PER_USER_STAKE);
    }

    function commonJoinAndCheckIn(bytes calldata checkInData) internal {
        vm.warp(block.timestamp);

        challenges.join(1);

        bytes32 digest = challenges.getCheckInDigest(1, checkInData);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        challenges.checkIn(1, checkInData, abi.encodePacked(r, s, v));
    }

    function test_Register() public view {
        IChallenges.Challenge memory _challenge = challenges.getChallenge(1);
        assertNotEq(_challenge.startTimestamp, 0, "Register failed");
    }

    function test_Join() public {
        challenges.join(1);
        assertEq(
            uint256(challenges.userStatus(1, address(this))), uint256(IChallenges.UserStatus.Joined), "Join failed"
        );
    }

    function test_RevertWhen_JoinPeriodEnded() public {
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert(IChallenges.InvalidTimestamp.selector);

        challenges.join(1);
    }

    function test_CheckIn(bytes calldata checkInData) public {
        commonJoinAndCheckIn(checkInData);
        assertEq(challenges.checkIns(1, address(this), 0), checkInData, "Check in failed");
    }

    function test_Settle(bytes calldata checkInData) public {
        commonJoinAndCheckIn(checkInData);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        assertEq(uint256(challenges.challengeStatus(1)), uint256(IChallenges.ChallengeStatus.Settled), "Settle failed");
        assertEq(challenges.getWinningStakePerUser(1), PER_USER_STAKE, "Settle failed");
    }

    function test_Withdraw(address failedUser, bytes calldata checkInData) public {
        vm.assume(failedUser != address(0));

        commonJoinAndCheckIn(checkInData);

        vm.startPrank(failedUser);
        stakingAsset.mint(failedUser, PER_USER_STAKE);
        stakingAsset.approve(address(challenges), PER_USER_STAKE);
        challenges.join(1);
        vm.stopPrank();

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        console2.log("Balance: ", stakingAsset.balanceOf(address(this)));

        uint256 beforeBalance = stakingAsset.balanceOf(address(this));
        challenges.withdraw(1);
        uint256 afterBalance = stakingAsset.balanceOf(address(this));
        IChallenges.Challenge memory _challenge = challenges.getChallenge(1);
        assertEq(
            afterBalance - beforeBalance,
            PER_USER_STAKE + PER_USER_STAKE * (10_000 - _challenge.donationBPS) / 10_000,
            "testing withdraw failed"
        );
        assertEq(stakingAsset.balanceOf(treasury), PER_USER_STAKE * _challenge.donationBPS / 10_000, "donation failed");
        assertEq(stakingAsset.balanceOf(address(challenges)), 0, "fund left in contract");
    }

    function test_FailedUserWithdraw() public {
        challenges.join(1);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        vm.expectRevert(IChallenges.UserNotClaimable.selector);
        challenges.withdraw(1);
    }
}

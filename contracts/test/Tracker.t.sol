// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../src/Alibuda.sol";
import "../src/Tracker.sol";

contract TrackerTest is Test {
    Alibuda underlying;
    Tracker tracker;
    address verifier;
    uint256 key;
    uint64 joinDueDays;
    uint64 challengeEndDays;
    uint256 constant PER_USER_STAKE = 100 * 1e6;

    function setUp() public {
        challengeEndDays = 100;
        joinDueDays = 1;

        underlying = new Alibuda();
        tracker = new Tracker(address(underlying), "Alibuda Habit Builder", "1.0");

        (verifier, key) = makeAddrAndKey("test_verifier");
        tracker.register(
            verifier,
            "test challenge",
            1,
            uint64(block.timestamp),
            uint64(block.timestamp + joinDueDays * 1 days),
            uint64(block.timestamp + challengeEndDays * 1 days),
            address(this),
            PER_USER_STAKE
        );
        underlying.approve(address(tracker), PER_USER_STAKE);
    }

    function commonJoinAndCheckIn(uint256 timestamp) internal {
        vm.warp(timestamp);

        tracker.join(1);

        bytes32 digest = tracker.getCheckInDigest(1, timestamp, address(this));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        tracker.checkIn(1, timestamp, v, r, s);
    }

    function test_Register() public view {
        (,, uint256 startTimestamp,,,,,,) = tracker.challenges(1);
        assertNotEq(startTimestamp, 0, "Register failed");
    }

    function test_Join() public {
        tracker.join(1);
        assertEq(tracker.hasJoined(1, address(this)), true, "Join failed");
    }

    function test_RevertWhen_JoinPeriodEnded() public {
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert("joining period has ended");

        tracker.join(1);
    }

    function test_CheckIn() public {
        commonJoinAndCheckIn(block.timestamp);
        assertNotEq(tracker.checkIns(1, address(this), 0), 0, "Check in failed");
    }

    function test_Settle() public {
        commonJoinAndCheckIn(block.timestamp);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        tracker.settle(1);
        (,,,,,,,, bool settled) = tracker.challenges(1);

        assertEq(settled, true, "Settle failed");
        assertEq(tracker.getClaimableAmount(1, address(this)), PER_USER_STAKE, "Settle failed");
    }

    function test_Withdraw(address failedUser) public {
        vm.assume(failedUser != address(0));

        commonJoinAndCheckIn(block.timestamp);

        vm.startPrank(failedUser);
        underlying.mint(failedUser, PER_USER_STAKE);
        underlying.approve(address(tracker), PER_USER_STAKE);
        tracker.join(1);
        vm.stopPrank();

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        tracker.settle(1);

        uint256 beforeBalance = underlying.balanceOf(address(this));
        tracker.withdraw(1);
        uint256 afterBalance = underlying.balanceOf(address(this));
        assertEq(afterBalance - beforeBalance, PER_USER_STAKE + PER_USER_STAKE / 2, "testing withdraw failed");
    }

    function test_FailedUserWithdraw() public {
        tracker.join(1);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        tracker.settle(1);

        uint256 beforeBalance = underlying.balanceOf(address(this));
        tracker.withdraw(1);
        uint256 afterBalance = underlying.balanceOf(address(this));
        assertEq(afterBalance - beforeBalance, 0, "testing failed user withdraw failed");
    }
}

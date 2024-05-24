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

    uint256 constant PER_USER_STAKE = 0.0001 ether;

    function setUp() public {
        underlying = new Alibuda();
        tracker = new Tracker(address(underlying), "Alibuda Habbit Builder", "1.0");

        (verifier, key) = makeAddrAndKey("test_verifier");
        tracker.register(
            verifier, "test challenge", 1, block.timestamp + 10, block.timestamp + 1000, address(this), PER_USER_STAKE
        );
        underlying.approve(address(tracker), PER_USER_STAKE);
    }

    function commonJoinAndCheckIn(uint256 timestamp) internal {
        tracker.join(1);
        bytes32 digest = tracker.getCheckInDigest(1, timestamp, address(this));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        vm.warp(timestamp + 11);
        tracker.checkIn(1, timestamp, v, r, s);
    }

    function test_Register() public view {
        (,, uint256 startTimestamp,,,,,) = tracker.challenges(1);
        assertNotEq(startTimestamp, 0, "Register failed");
    }

    function test_Join() public {
        tracker.join(1);
        assertEq(tracker.hasJoined(1, address(this)), true, "Join failed");
    }

    function test_CheckIn(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        commonJoinAndCheckIn(timestamp);
        assertNotEq(tracker.checkIns(1, address(this), 0), 0, "Check in failed");
    }

    function test_Settle(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        commonJoinAndCheckIn(timestamp);

        vm.warp(block.timestamp + 1001);
        tracker.settle(1);
        (,,,,,,, bool settled) = tracker.challenges(1);
        assertEq(settled, true, "Settle failed");
        assertEq(tracker.getClaimableAmount(1, address(this)), PER_USER_STAKE, "Settle failed");
    }

    function test_Withdraw(address failedUser, uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        vm.assume(failedUser != address(0));
        commonJoinAndCheckIn(timestamp);

        vm.startPrank(failedUser);
        underlying.mint(failedUser, PER_USER_STAKE);
        underlying.approve(address(tracker), PER_USER_STAKE);
        tracker.join(1);
        vm.stopPrank();

        vm.warp(block.timestamp + 1001);
        tracker.settle(1);

        uint256 beforeBalance = underlying.balanceOf(address(this));
        tracker.withdraw(1);
        uint256 afterBalance = underlying.balanceOf(address(this));
        assertEq(afterBalance - beforeBalance, PER_USER_STAKE + PER_USER_STAKE / 2, "testing withdraw failed");
    }

    function test_FailedUserWithdraw(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        tracker.join(1);

        vm.warp(block.timestamp + 1001);
        tracker.settle(1);

        uint256 beforeBalance = underlying.balanceOf(address(this));
        tracker.withdraw(1);
        uint256 afterBalance = underlying.balanceOf(address(this));
        assertEq(afterBalance - beforeBalance, 0, "testing failed user withdraw failed");
    }
}

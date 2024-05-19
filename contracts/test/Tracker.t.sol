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

    function setUp() public {
        underlying = new Alibuda();
        tracker = new Tracker(address(underlying), "Alibuda Habbit Builder", "1.0");

        (verifier, key) = makeAddrAndKey("test_verifier");
        tracker.register(
            verifier, "test challenge", 1, block.timestamp + 10, block.timestamp + 1000, address(this), 0.0001 ether
        );
        underlying.approve(address(tracker), 0.0001 ether);
    }

    function commonJoinAndCheckIn(uint256 timestamp) internal {
        tracker.join(0);
        bytes32 digest = tracker.getCheckInDigest(0, timestamp, address(this));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        vm.warp(timestamp + 11);
        tracker.checkIn(0, timestamp, v, r, s);
    }

    function test_register() public view {
        (,, uint256 startTimestamp,,,,,) = tracker.challenges(0);
        require(startTimestamp != 0, "Register failed");
    }

    function test_join() public {
        tracker.join(0);
        require(tracker.hasJoined(0, address(this)), "Join failed");
    }

    function test_checkIn(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        commonJoinAndCheckIn(timestamp);
        require(tracker.checkIns(0, address(this), 0) != 0, "Check in failed");
    }

    function test_settle(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < 1e20);
        commonJoinAndCheckIn(timestamp);

        vm.warp(block.timestamp + 1001);
        tracker.settle(0);
        (,,,,,,, bool settled) = tracker.challenges(0);
        require(settled, "Settle failed");
        require(tracker.balances(address(this)) == 0.0001 ether, "Settle failed");
    }
}

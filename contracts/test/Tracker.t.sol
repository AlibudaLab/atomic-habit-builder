// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../src/Alibuda.sol";
import "../src/Tracker.sol";

contract TrackerTest is Test {
    Alibuda underlying;
    Tracker tracker;
    /* below are the values retrieved from arx signing */
    address arxAddress = address(0x883167E6b5d489B82cB97bEf9C7967afe3A3D299);
    uint8 v = 28;
    bytes32 r = 0x89d1de75809b34b33cd364af7dee9dbea2f1cda683199d46e5ba3cc50de0b043;
    bytes32 s = 0x32f97aa964371f4afa35ce35234b59df65ffbb4260ea71349d374742b012364b;

    function setUp() public {
        underlying = new Alibuda();
        tracker = new Tracker(address(underlying));
        tracker.register(
            arxAddress, "test challenge", 1, block.timestamp + 10, block.timestamp + 1000, address(this), 0.0001 ether
        );
        underlying.approve(address(tracker), 0.0001 ether);
    }

    function test_register() public view {
        (,,uint256 startTimestamp,,,,,) = tracker.challenges(0);
        require(startTimestamp != 0, "Register failed");
    }

    function test_join() public {
        tracker.join(0);
        require(tracker.hasJoined(0, address(this)), "Join failed");
    }

    function test_checkIn() public {
        tracker.join(0);
        bytes memory encoded = abi.encodePacked("\x19Ethereum Signed Message:\n21test check in message");
        bytes32 msgHash = keccak256(encoded);

        vm.warp(block.timestamp + 11);
        tracker.checkIn(0, msgHash, v, r, s);
        require(tracker.checkIns(0, address(this), 0) != 0, "Check in failed");
    }

    function test_settle() public {
        tracker.join(0);
        bytes memory encoded = abi.encodePacked("\x19Ethereum Signed Message:\n21test check in message");
        bytes32 msgHash = keccak256(encoded);

        vm.warp(block.timestamp + 11);
        tracker.checkIn(0, msgHash, v, r, s);

        vm.warp(block.timestamp + 1001);
        tracker.settle(0);
        (,,,,,,, bool settled) = tracker.challenges(0);
        require(settled, "Settle failed");
        require(tracker.balances(address(this)) == 0.0001 ether, "Settle failed");
    }
}

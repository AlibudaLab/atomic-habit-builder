// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Tracker} from "../src/Tracker.sol";

contract TrackerScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        Tracker tracker = new Tracker();
        vm.stopBroadcast();
        tracker.register(
            address(this),
            "test challenge",
            1,
            block.timestamp + 10,
            block.timestamp + 1000,
            address(this),
            0.0001 ether
        );
    }
}

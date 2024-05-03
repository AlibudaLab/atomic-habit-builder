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
    }
}

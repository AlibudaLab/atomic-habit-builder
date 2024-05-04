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
        tracker.register(address(0x883167E6b5d489B82cB97bEf9C7967afe3A3D299), "Run at Sydney Park 10 times", 10, block.timestamp + 10, block.timestamp + 1000, address(0xc108B7256052137a1b785192E172670f3BC8dCD6), 0.001 ether);
        tracker.register(address(0xcAb2459DE5C9109B82c3fAc92B5c80209FA53C07), "Go coworking with cool devs at ETHSydney", 5, block.timestamp + 10, block.timestamp + 1000, address(0xc108B7256052137a1b785192E172670f3BC8dCD6), 0.003 ether);
        vm.stopBroadcast();
   }
}

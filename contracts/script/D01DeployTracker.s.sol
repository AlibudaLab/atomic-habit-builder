// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";
import {Tracker} from "../src/Tracker.sol";


contract Deploy is Script {
    address official_verifier = 0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897;
    
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        preDeploy();
        deploy();
        postDeploy();
        vm.stopBroadcast();
    }

    function preDeploy() public {}

    function deploy() public {
        address _underlyingToken = vm.envAddress("ALIBUDA_TOKEN");
        Tracker tracker = new Tracker(_underlyingToken, "Alibuda Habit Builder", "1.0");
        tracker.register(
            address(0x883167E6b5d489B82cB97bEf9C7967afe3A3D299),
            "NFC Challenge 3",
            10,
            block.timestamp + 10,
            block.timestamp + 1000,
            address(0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897),
            0.02 ether
        );
        tracker.register(
            address(0xcAb2459DE5C9109B82c3fAc92B5c80209FA53C07),
            "NFC Challenge 2",
            5,
            block.timestamp + 10,
            block.timestamp + 1000,
            address(0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897),
            0.05 ether
        );
        tracker.register(
            official_verifier,
            "Nonce Run Club May",
            10,
            1714492800, // May 1
            1717084800, // May 31
            address(0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897),
            0.025 ether
        );

        tracker.register(
            official_verifier,
            "Nonce Run Club June",
            10,
            1717171200, // June 1
            1719676800, // June 30
            address(0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897),
            0.025 ether
        );
    }

    function postDeploy() public {}
}

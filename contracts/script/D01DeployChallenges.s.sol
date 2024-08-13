// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";
import {IChallenges} from "../src/interfaces/IChallenges.sol";
import {Challenges} from "../src/Challenges.sol";

contract Deploy is Script {
    address initGovernance = 0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897;
    address officialVerifier = 0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897;

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
        address underlying = vm.envAddress("TESTNET_TOKEN");
        Challenges challenges = new Challenges("Habit Builder", "1.0", initGovernance);
        challenges.create(
            IChallenges.Challenge(
                officialVerifier,
                3,
                1720418400, // July 8
                1720828800, // July 13 0:00
                1720828800, // July 13 0:00
                officialVerifier,
                address(0),
                underlying,
                5_000,
                50 * 1e6
            )
        );

        challenges.create(
            IChallenges.Challenge(
                officialVerifier,
                12,
                1720396800, // 7/8
                1723075200, // 8/8
                1723075200, // 8/8
                officialVerifier,
                address(0),
                underlying,
                5_000,
                50 * 1e6
            )
        );

        challenges.create(
            IChallenges.Challenge(
                officialVerifier,
                10,
                1719763200, // July 1
                1722355200, // July 31
                1722355200, // July 31
                officialVerifier,
                address(0),
                underlying,
                5_000,
                25 * 1e6
            )
        );
    }

    function postDeploy() public {}
}

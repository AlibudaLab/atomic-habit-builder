// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";
import {IChallenges} from "../src/interfaces/IChallenges.sol";
import {Challenges} from "../src/Challenges.sol";

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
        address underlying = vm.envAddress("TESTNET_TOKEN");
        Challenges challenges = new Challenges("Habit Builder", "1.0");
        challenges.create(
            IChallenges.Challenge(
                official_verifier,
                3,
                1720418400, // July 8
                1720828800, // July 13 0:00
                1720828800, // July 13 0:00
                official_verifier,
                5_000,
                address(0),
                underlying,
                50 * 1e6
            )
        );

        challenges.create(
            IChallenges.Challenge(
                official_verifier,
                12,
                1720396800, // 7/8
                1723075200, // 8/8
                1723075200, // 8/8
                official_verifier,
                5_000,
                address(0),
                underlying,
                50 * 1e6
            )
        );

        challenges.create(
            IChallenges.Challenge(
                official_verifier,
                10,
                1719763200, // July 1
                1722355200, // July 31
                1722355200, // July 31
                official_verifier,
                5_000,
                address(0),
                underlying,
                25 * 1e6
            )
        );
    }

    function postDeploy() public {}
}

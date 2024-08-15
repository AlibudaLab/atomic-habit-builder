// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";
import {IChallenges} from "../src/interfaces/IChallenges.sol";
import {Challenges} from "../src/Challenges.sol";

contract Deploy is Script {
    address initGovernance = 0x21a4175FdF0BC084eaA63d277212790ee6a07789;
    address officialVerifier = 0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897;
    uint128 minDonationBPS = 1_000;

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
        Challenges challenges = new Challenges("Habit Builder", "1.0", initGovernance, minDonationBPS);

        challenges.setDonationOrgEnabled(initGovernance, true);

        challenges.create(
            IChallenges.Challenge(
                officialVerifier,
                2,
                1722470400, // August 1 0:00
                1723823998, // August 31 23:59
                1723823999, // August 31 23:59
                initGovernance,
                address(0),
                underlying,
                5_000,
                50 * 1e6
            )
        );

        // challenges.create(
        //     IChallenges.Challenge(
        //         officialVerifier,
        //         12,
        //         1722470400, // August 1 0:00
        //         1725148798, // August 31 23:59
        //         1725148799, //  August 31 23:59
        //         officialVerifier,
        //         address(0),
        //         underlying,
        //         5_000,
        //         3 * 1e6
        //     )
        // );

        // challenges.create(
        //     IChallenges.Challenge(
        //         officialVerifier,
        //         10,
        //         1722470400, // August 1 0:00
        //         1725148798, // August 31 23:59
        //         1725148799, // August 31 23:59
        //         officialVerifier,
        //         address(0),
        //         underlying,
        //         5_000,
        //         2 * 1e6
        //     )
        // );
    }

    function postDeploy() public {}
}

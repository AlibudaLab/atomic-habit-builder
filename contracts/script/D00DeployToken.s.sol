// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import {Alibuda} from "../src/Alibuda.sol";

contract Deploy is Script {
    using Strings for uint256;

    function run() public {
        vm.startBroadcast();
        preDeploy();
        deploy();
        postDeploy();
        vm.stopBroadcast();
    }

    function preDeploy() public {}

    function deploy() public {
        console.log("Deploying with Address: ", msg.sender);
        Alibuda alibuda = new Alibuda();
    }

    function postDeploy() public {}
}

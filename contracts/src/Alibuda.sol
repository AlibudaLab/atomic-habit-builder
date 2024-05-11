// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./config/errors.sol";

contract Alibuda is ERC20 {
    constructor() ERC20("Alibuda", "ALB") {
        _mint(msg.sender, 1_000_000_000 * 1e18);
    }

    function mint(address to, uint256 amount) public {
        if (amount > 1_000 * 1e18) {
            revert ExceedMaxAmount();
        }
        _mint(to, amount);
    }
}

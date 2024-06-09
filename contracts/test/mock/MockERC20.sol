// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    error ExceedMaxAmount();

    uint8 private __decimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20(_name, _symbol) {
        __decimals = _decimals;
    }

    function decimals() public view virtual override returns (uint8) {
        return __decimals;
    }

    function mint(address to, uint256 amount) public {
        if (amount > 1e21) {
            revert ExceedMaxAmount();
        }
        _mint(to, amount);
    }
}

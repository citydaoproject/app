pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("YourToken", "YTK") {
        _mint(msg.sender, initialSupply);
    }
}

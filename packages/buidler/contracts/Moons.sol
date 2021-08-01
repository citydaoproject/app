pragma solidity ^0.6.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Moons is ERC20 {
  constructor() ERC20("MOONS","🌘") public {
      _mint(msg.sender,100000*10**18);
  }
}

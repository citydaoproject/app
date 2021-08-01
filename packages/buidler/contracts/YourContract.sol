pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract YourContract {

  bytes32[] public hashes;

  constructor(bytes32[] memory _hashes) public {
    hashes = _hashes;
  }

}

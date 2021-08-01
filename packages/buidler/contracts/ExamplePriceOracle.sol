pragma solidity >=0.6.0 <0.7.0;

contract ExamplePriceOracle {
  function getTokenPrice() public view returns (uint) {
    return 200 * 10 ** 18;
  }
}

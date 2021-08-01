pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

contract IGovernor {
  uint256 public denominator;
  address[] public recipients;
  uint8[] public ratios;
  function recipientsLength() public view returns(uint8 count) {}
  function getRatios() public view returns(uint8[] memory) {}
  function getRecipients() public view returns(address[] memory) {}
}

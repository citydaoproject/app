pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWETH9.sol";

contract Governor is Ownable{

  event AllocationSet( address[] recipients, uint8[] ratios );

  uint256 public denominator;
  address[] public recipients;
  uint8[] public ratios;

  constructor(address newOwner, address[] memory _recipients,uint8[] memory _ratios) public {
    setAllocation( _recipients, _ratios );
    transferOwnership( newOwner );
  }

  function getRatios() public view returns(uint8[] memory) {
    return ratios;
  }

  function getRecipients() public view returns(address[] memory) {
    return recipients;
  }

  function setAllocation( address[] memory _recipients, uint8[] memory _ratios ) public onlyOwner {
    require( _recipients.length > 0 ,"Not enough wallets");
    require( _recipients.length < 256 ,"Too many wallets");
    require( _recipients.length == _ratios.length ,"Wallet and Ratio length not equal");
    recipients = _recipients;
    ratios = _ratios;
    denominator = 0;
    for(uint8 i = 0; i < recipients.length; i++){
      require(_recipients[i]!=address(this),"Contract cant be recipient");
      denominator+=_ratios[i];
    }
    emit AllocationSet(recipients,ratios);
  }

  function recipientsLength() public view returns(uint8 count) {
      return uint8(recipients.length);
  }

}

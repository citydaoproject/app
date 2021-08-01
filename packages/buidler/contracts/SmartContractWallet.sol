pragma solidity >=0.6.0 <0.7.0;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet is BaseRelayRecipient {

  string public title = "📄 Smart Contract Wallet";
  address public owner;

  constructor() public {
    owner = msg.sender;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  fallback() external payable {
    console.log(msg.sender,"just deposited",msg.value);
  }

  function withdraw() public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(msg.sender,"withdraws",(address(this)).balance);
    msg.sender.transfer((address(this)).balance);
  }

  function updateOwner(address newOwner) public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(_msgSender(),msg.sender,"updates owner to",newOwner);
    owner = newOwner;
    emit UpdateOwner(_msgSender(),owner);
  }
  event UpdateOwner(address oldOwner, address newOwner);

  function setTrustedForwarder(address _trustedForwarder) public {
    trustedForwarder = _trustedForwarder;
  }

}

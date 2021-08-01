pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  address public owner;

  constructor(address _owner) public {
    owner = _owner;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  function withdraw() public {
    require(msg.sender==owner,"NOT THE OWNER!");
    console.log(msg.sender,"withdraws",(address(this)).balance);
    msg.sender.transfer((address(this)).balance);
  }

  function isOwner(address possibleOwner) public view returns (bool) {
    return (possibleOwner==owner);
  }

  function updateOwner(address newOwner) public {
    require(isOwner(msg.sender),"NOT THE OWNER!");
    owner = newOwner;
  }

  uint constant public limit = 0.005 * 10**18;
  fallback() external payable {
    require(((address(this)).balance) <= limit, "WALLET LIMIT REACHED");
    console.log(msg.sender,"just deposited",msg.value);
  }

  mapping(address => bool) public friends;

  function updateFriend(address friendAddress, bool isFriend) public {
    require(isOwner(msg.sender),"NOT THE OWNER!");
    friends[friendAddress] = isFriend;
    console.log(friendAddress,"friend bool set to",isFriend);
    emit UpdateFriend(msg.sender,friendAddress,isFriend);
  }
  event UpdateFriend(address sender, address friend, bool isFriend);

  uint public timeToRecover = 0;
  uint constant public timeDelay = 120; //seconds
  address public recoveryAddress;

  function setRecoveryAddress(address _recoveryAddress) public {
    require(isOwner(msg.sender),"NOT THE OWNER!");
    console.log(msg.sender,"set the recoveryAddress to",recoveryAddress);
    recoveryAddress = _recoveryAddress;
  }

  function friendRecover() public {
    require(friends[msg.sender],"NOT A FRIEND");
    timeToRecover = block.timestamp + timeDelay;
    console.log(msg.sender,"triggered recovery",timeToRecover,recoveryAddress);
  }

  function cancelRecover() public {
    require(isOwner(msg.sender),"NOT THE OWNER");
    timeToRecover = 0;
    console.log(msg.sender,"canceled recovery");
  }

  function recover() public {
    require(timeToRecover>0 && timeToRecover<block.timestamp,"NOT EXPIRED");
    console.log(msg.sender,"triggered recover");
    selfdestruct(payable(recoveryAddress));
  }

}

pragma solidity >=0.6.0 <0.7.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@nomiclabs/buidler/console.sol";


contract IExampleTokenPriceOracle {
  function getTokenPrice() public view returns (uint) {}
}

contract SmartContractWallet {

  bytes32 public mode = "init";
  uint constant threshold = 0.002 * 10**18;
  address public tokenAddress;
  address public priceOracle;

  address[] public members;
  mapping(address => uint) public balances;
  mapping(address => uint8) public preferences;

  function setPreference(uint8 percentStable) public {
    preferences[msg.sender] = percentStable;
    console.log(msg.sender, "wants the stability to be", percentStable);
  }

  function updateMode() public {
    if( mode=="open" && isOverThreshold() ){
      mode = "active";
    }
  }

  function isOverThreshold() public view returns (bool) {
    if( mode=="open"){
      return ( (address(this)).balance >= threshold );
    }else{
      return false;
    }
  }

  function isActiveAccount() public view returns (bool) {
    if(mode=="active" && balances[msg.sender]>0 ){
      return true;
    }
    return false;
  }

  function isMember(address member) public view returns (bool) {
    for (uint8 memberId = 0; memberId < members.length; memberId++) {
      if(members[memberId]==member){
        return true;
      }
    }
    return false;
  }

  function influence(address member) public view returns (uint) {
    if(balances[member]<=0) return 0;
    return balances[member] * 100 / (address(this)).balance;
  }

  function stability() public view returns (uint8) {
    //balance of eth vs balance of tokens
    IERC20 tokenContract = IERC20(tokenAddress);
    IExampleTokenPriceOracle priceContract = IExampleTokenPriceOracle(priceOracle);
    uint tokenPrice = priceContract.getTokenPrice();
    console.log("tokenPrice",tokenPrice);
    uint tokenValue = tokenContract.balanceOf(address(this)) * (tokenPrice / 10**18);
    console.log("tokenValue",tokenValue);
    return uint8(((address(this)).balance) / tokenValue / 100);
  }

  function stabilityTarget() public view returns (uint8) {
    uint sum = 0;
    for (uint8 memberId = 0; memberId < members.length; memberId++) {
      sum += preferences[members[memberId]] * influence(members[memberId]);
    }
    return uint8(sum/100);
  }

  constructor(address _tokenAddress,address _priceOracle) public {
    tokenAddress = _tokenAddress;
    priceOracle = _priceOracle;
    console.log("Smart Contract Wallet is deployed with token:",tokenAddress);
    console.log("and price oracle:",priceOracle);
    mode = "open";
  }

  uint constant limit = 0.1 * 10**18;
  fallback() external payable {
      require(((address(this)).balance + msg.value) <= limit, "WALLET LIMIT REACHED");
      require(mode=="open","WALLET IS NOT OPEN");
      balances[msg.sender] += msg.value;
      if(!isMember(msg.sender)) members.push(msg.sender);
      console.log(msg.sender,"just deposited",msg.value);
  }

  function withdraw() public {
    uint balance = balances[msg.sender];
    require(balance > 0, "NO FUNDS");
    balances[msg.sender] = 0;
    msg.sender.transfer(balance);
    console.log(msg.sender, "just withdrew", balance);
  }

}

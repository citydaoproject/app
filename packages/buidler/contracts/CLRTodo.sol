pragma solidity >=0.6.6 <0.7.0;

import "@nomiclabs/buidler/console.sol";

/// CLR - Capital-constrained Liberal Radicalism
// https://medium.com/gitcoin/experiments-with-liberal-radicalism-ad68e02efd4
// (the square of the sum of the square roots)

contract CLRTodo {

  //the contract itself should accept donations from anyone
  // this will be distributed using CLR matching based on how todos are supported
  receive() external payable {
    require(isOpen(),"CLRTodo:receive round is not open");
    console.log(msg.sender,"donationated",msg.value);
  }

  //we pick a date in the future when the payout will happen
  uint256 ENDTIME = block.timestamp + 120; // round runs for 120s (obv very fast for testing)

  //this function will tell us if the CLR round is open
  // (we accept projects and support when open, projects can withdraw after it closes)
  function isOpen() public view returns (bool) {
    return block.timestamp < ENDTIME;
  }

  //a nice read function to help the frontend
  function timeLeft() public view returns (uint256) {
    if(isOpen()){
      return ENDTIME - block.timestamp;
    }else{
      return 0;
    }
  }

  //todo is stored as simple struct and we track support (donations directly to this todo)
  struct Todo {
    string name;
    uint256 support;
    uint256 sqrtSupport;
    bool withdrawn;
    address payable supportDestination;
  }

  Todo[] public todos;

  function addTask(string memory _name, address payable _supportDestination) public {
    require(isOpen(),"CLRTodo:addTask round is not open");
    Todo memory todo = Todo({
      name: _name,
      support: 0,
      sqrtSupport: 0,
      withdrawn: false,
      supportDestination: _supportDestination
    });
    todos.push(todo);
  }

  function getLength() public view returns (uint256) {
    return todos.length;
  }

  function supportTodo(uint16 id) public payable {
    require(isOpen(),"CLRTodo:supportTodo round is not open");
    todos[id].support += msg.value;
    console.log("support",id,msg.sender,msg.value);
    uint256 sqrtSupport = sqrt(msg.value);
    console.log("sqrtSupport",sqrtSupport);
    todos[id].sqrtSupport += sqrtSupport;
  }

  uint256 finalTotalBalance = 0;
  uint256 totalSquaredSupport = 0;
  uint256 totalSupport = 0;

  //this function could be run in multiple steps paying attention to msg.gas (remaining gas)
  // (when gas gets low you keep track of where you are in the for loop and drop out)
  // (then you call it again and it starts where it left off until it gets to the end)
  function calculate() public {
    require(!isOpen(),"CLRTodo:calculate round is still open");
    require(totalSupport==0,"CLRTodo:calculate already calculated");
    finalTotalBalance = (address(this)).balance;
    for(uint16 i=0;i<todos.length;i++){
      totalSquaredSupport += todos[i].sqrtSupport * todos[i].sqrtSupport;
      totalSupport += todos[i].support;
    }
    console.log("totalSquaredSupport",totalSquaredSupport);
    console.log("totalSupport",totalSupport);
    finalTotalBalance -= totalSupport;//we don't want to split the total balance, just the extra "matching" funds
  }

  function withdraw(uint16 id) public returns (uint256) {
    require(!isOpen(),"CLRTodo:withdraw round is still open");
    require(finalTotalBalance>0,"CLRTodo:withdraw not calculated yet");
    require(!todos[id].withdrawn,"CLRTodo:withdraw already withdrawn");
    todos[id].withdrawn = true;
    uint256 squareOfTheSumOfTheSqrt = todos[id].sqrtSupport * todos[id].sqrtSupport;
    uint256 payout = squareOfTheSumOfTheSqrt * finalTotalBalance / totalSquaredSupport;
    payout += todos[id].support;
    console.log("payout",id,payout);
    todos[id].supportDestination.transfer(payout);
    return payout;
  }

  function sqrt(uint256 x) public pure returns (uint256) {
    uint256 z = (x + 1) / 2;
    uint256 y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
    return y;
  }

}

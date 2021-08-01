pragma solidity 0.8.0;
//SPDX-License-Identifier: MIT

contract YourContract {

  event Update(uint256 x, uint256 y, address indexed owner, bytes3 color);

  struct Square {
    address owner;
    bytes3 color;
  }

  uint256 public constant SIZE = 16;
  Square[SIZE][SIZE] public squares;

  function set(uint256 x,uint256 y,address newOwner,bytes3 newColor) public {
    squares[x][y].owner = newOwner;
    squares[x][y].color = newColor;
    emit Update(x, y, newOwner, newColor);
  }
/*
  function move(uint256 fx,uint256 fy,uint256 tx,uint256 ty) public {
    squares[tx][ty] = squares[fx][fy];
    delete squares[fx][fy];
  }

  function swap(uint256 fx,uint256 fy,uint256 tx,uint256 ty) public {
    Square memory temp = squares[tx][ty];
    squares[tx][ty] = squares[fx][fy];
    squares[fx][fy] = temp;
  }
*/
}

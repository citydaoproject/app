pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract CityDaoParcel is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => bool) private _plotIdToSoldStatus;
  mapping(uint256 => uint256) private _plotIdToPrice;
  uint256[] private _plotIds = new uint256[](0);
  string[] private _plotURIs = new string[](0);

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    _tokenIds.increment(); // reserve 0 for "no plot" id
  }

  function listPlot(string memory tokenURI, uint256 price) public onlyOwner returns (uint256) {
    uint256 plotId = _tokenIds.current();
    _tokenIds.increment();
    _plotIdToPrice[plotId] = price;
    _plotIdToSoldStatus[plotId] = false;
    _plotIds.push(plotId);
    _plotURIs.push(tokenURI);

    return plotId;
  }

  function mintPlot(address _toAddress, uint256 plotId)
      public
      returns (uint256)
  {
      require(msg.sender == _toAddress, "You must purchase the plot for yourself!");
      require(!isSold(plotId), "This plot has already been sold!");
      
      _safeMint(_toAddress, plotId);

      uint256 _idx = getIndex(plotId);
      _setTokenURI(plotId, _plotURIs[_idx]);

      delete _plotIdToPrice[plotId];
      _plotIdToSoldStatus[plotId] = true;

      return plotId;
  }

  function isSold(uint256 plotId) public view returns (bool) {
    return _plotIdToSoldStatus[plotId];
  }
  function getPrice(uint256 plotId) public view returns (uint256) {
    return _plotIdToPrice[plotId];
  }

  function getPlotURIs() public view returns (string[] memory) {
    return _plotURIs;
  }

  function getPlotIds() public view returns (uint256[] memory) {
    return _plotIds;
  }

  function getIndex(uint256 plotId) public view returns (uint256) {
    for(uint i = 0; i < _plotIds.length; i++){
      if(plotId == _plotIds[i]) return i;
    }
  }
}

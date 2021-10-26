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
  mapping(uint256 => uint) private _plotIdToPrice;
  uint256[] private _plotIds = new uint256[](0);
  string private metadataUri;

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    _tokenIds.increment(); // reserve 0 for "no plot" id
  }

  function listPlot(uint256 price) public onlyOwner returns (uint256) {
    uint256 plotId = _tokenIds.current();
    _tokenIds.increment();
    _plotIdToPrice[plotId] = price;
    _plotIdToSoldStatus[plotId] = false;
    _plotIds.push(plotId);

    return plotId;
  }

  function setMetadata(string memory uri) public onlyOwner {
    metadataUri = uri;
  }

  function getMetadataUri() public view returns (string memory) {
    return metadataUri;
  }

   function buyPlot(uint256 plotId)
      payable
      public
      returns (uint256)
  {
      require(!isSold(plotId), "This plot has already been sold!");
      uint256 _price = _plotIdToPrice[plotId];
      require(msg.value == _price, "You must pay the price of the plot!");

      _safeMint(msg.sender, plotId);

      delete _plotIdToPrice[plotId];
      _plotIdToSoldStatus[plotId] = true;

      return plotId;
  }

  function isSold(uint256 plotId) public view returns (bool) {
    return _plotIdToSoldStatus[plotId];
  }
  function getPrice(uint256 plotId) public view returns (uint) {
    return _plotIdToPrice[plotId];
  }

  function getPlotIds() public view returns (uint256[] memory) {
    return _plotIds;
  }
}

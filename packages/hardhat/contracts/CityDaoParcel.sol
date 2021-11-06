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
  string private plotMetadataUri;
  string private parcelMetadataUri;

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

  function setParcelMetadata(string memory uri) public onlyOwner {
    parcelMetadataUri = uri;
  }

  function setPlotsMetadata(string memory uri) public onlyOwner {
    plotMetadataUri = uri;
  }

  function getParcelMetadataUri() public view returns (string memory) {
    return parcelMetadataUri;
  }

  function getPlotsMetadataUri() public view returns (string memory) {
    return plotMetadataUri;
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

  function getOwners() public view returns (address[] memory) {
    address[] memory _owners = new address[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
      uint256 _plotId = _plotIds[i];
      if (isSold(_plotId)) {
        _owners[i] = ownerOf(_plotIds[i]);
      } else {
        _owners[i] = address(0);
      }
    }
    return _owners;
  }

  function getAllPrices() public view returns (uint256[] memory) {
    uint256[] memory ret = new uint256[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
        ret[i] = _plotIdToPrice[_plotIds[i]];
    }
    return ret;
  }

  function getAllSoldStatus() public view returns (bool[] memory) {
    bool[] memory ret = new bool[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
        ret[i] = _plotIdToSoldStatus[_plotIds[i]];
    }
    return ret;
  }
}

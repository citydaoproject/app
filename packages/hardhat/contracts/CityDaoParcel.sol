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

  mapping(uint256 => string) private _parcelIdToTokenURI;
  mapping(uint256 => bool) private _parcelIdToSoldStatus;
  mapping(uint256 => string) private _parcelIdToPrice;
  uint256[] private _parcelIds = new uint256[](0);

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    _tokenIds.increment(); // reserve 0 for "no parcel" id
  }

  function listParcel(string memory tokenURI, string memory price) public onlyOwner returns (uint256) {
    uint256 parcelId = _tokenIds.current();
    _tokenIds.increment();
    _parcelIdToTokenURI[parcelId] = tokenURI;
    _parcelIdToPrice[parcelId] = price;
    _parcelIdToSoldStatus[parcelId] = false;
    _parcelIds.push(parcelId);

    return parcelId;
  }

  function mintParcel(address _toAddress, uint256 parcelId)
      public
      returns (uint256)
  {
      if(msg.sender != _toAddress) revert("You must purchase the parcel for yourself!");
      if(isSold(parcelId)) revert("This parcel has already been sold!");
      
      _safeMint(_toAddress, parcelId);
      _setTokenURI(parcelId, _parcelIdToTokenURI[parcelId]);

      delete _parcelIdToPrice[parcelId];
      _parcelIdToSoldStatus[parcelId] = true;

      return parcelId;
  }

  function isSold(uint256 parcelId) public view returns (bool) {
    return _parcelIdToSoldStatus[parcelId];
  }
  function getPrice(uint256 parcelId) public view returns (string memory) {
    return _parcelIdToPrice[parcelId];
  }

  function getListedParcelURIs() public view returns (string[] memory) {
    uint256[] memory listedParcelIds = getListedParcelIds();
    string[] memory ret = new string[](listedParcelIds.length);
    for (uint i = 0; i < listedParcelIds.length; i++) {
      if (_parcelIdToSoldStatus[listedParcelIds[i]] == false) {
        ret[i] = _parcelIdToTokenURI[listedParcelIds[i]];
      }
    }
    return ret;
  }
  function getSoldParcelURIs() public view returns (string[] memory) {
    uint256[] memory soldParcelIds = getSoldParcelIds();
    string[] memory ret = new string[](soldParcelIds.length);
    for (uint i = 0; i < soldParcelIds.length; i++) {
      if (_parcelIdToSoldStatus[soldParcelIds[i]] == true) {
        ret[i] = _parcelIdToTokenURI[soldParcelIds[i]];
      }
    }
    return ret;
  }

  function getListedParcelIds() public view returns (uint256[] memory) {
    uint256[] memory ret = new uint256[](_parcelIds.length);
    for (uint i = 0; i < _parcelIds.length; i++) {
      if (_parcelIdToSoldStatus[_parcelIds[i]] == false) {
        ret[i] = _parcelIds[i];
      }
    }
    return ret;
  }
  function getSoldParcelIds() public view returns (uint256[] memory) {
    uint256[] memory ret = new uint256[](_parcelIds.length);
    for (uint i = 0; i < _parcelIds.length; i++) {
      if (_parcelIdToSoldStatus[_parcelIds[i]] == true) {
        ret[i] = _parcelIds[i];
      }
    }
    return ret;
  }
}

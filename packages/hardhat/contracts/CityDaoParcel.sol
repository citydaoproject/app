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

  mapping(uint256 => bool) private _parcelIdToSoldStatus;
  mapping(uint256 => string) private _parcelIdToPrice;
  uint256[] private _parcelIds = new uint256[](0);
  string[] private _parcelURIs = new string[](0);

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    _tokenIds.increment(); // reserve 0 for "no parcel" id
  }

  function listParcel(string memory tokenURI, string memory price) public onlyOwner returns (uint256) {
    uint256 parcelId = _tokenIds.current();
    _tokenIds.increment();
    _parcelIdToPrice[parcelId] = price;
    _parcelIdToSoldStatus[parcelId] = false;
    _parcelIds.push(parcelId);
    _parcelURIs.push(tokenURI);

    return parcelId;
  }

  function mintParcel(address _toAddress, uint256 parcelId)
      public
      returns (uint256)
  {
      require(msg.sender == _toAddress, "You must purchase the parcel for yourself!");
      require(!isSold(parcelId), "This parcel has already been sold!");
      
      _safeMint(_toAddress, parcelId);

      uint256 _idx = getIndex(parcelId);
      _setTokenURI(parcelId, _parcelURIs[_idx]);

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

  function getParcelURIs() public view returns (string[] memory) {
    return _parcelURIs;
  }

  function getParcelIds() public view returns (uint256[] memory) {
    return _parcelIds;
  }

  function getIndex(uint256 parcelId) public view returns (uint256) {
    for(uint i = 0; i < _parcelIds.length; i++){
      if(parcelId == _parcelIds[i]) return i;
    }
  }
}

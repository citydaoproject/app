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
  mapping(uint256 => string) private _parcelIdToPrice;
  uint256[] private _parcelIds = new uint256[](0);

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  function listParcel(string memory tokenURI, string memory price) public onlyOwner returns (uint256) {
    uint256 parcelId = _tokenIds.current();
    _tokenIds.increment();
    _parcelIdToTokenURI[parcelId] = tokenURI;
    _parcelIdToPrice[parcelId] = price;
    _parcelIds.push(parcelId);

    return parcelId;
  }

  function mintParcel(address _toAddress, uint256 parcelId)
      public
      returns (uint256)
  {
      require(msg.sender == _toAddress);
      
      _safeMint(_toAddress, parcelId);
      _setTokenURI(parcelId, _parcelIdToTokenURI[parcelId]);

      delete _parcelIdToPrice[parcelId];
      delete _parcelIdToTokenURI[parcelId];

      return parcelId;
  }

  function getListedParcels() public view returns (string[] memory) {
    string[] memory ret = new string[](_parcelIds.length);
    for (uint i = 0; i < _parcelIds.length; i++) {
        ret[i] = _parcelIdToTokenURI[i];
    }
    return ret;
  }

  function getPrice(uint256 parcelId) public view returns (string memory) {
    return _parcelIdToPrice[parcelId];
  }

  function getParcelIds() public view returns (uint256[] memory) {
    return _parcelIds;
  }
}

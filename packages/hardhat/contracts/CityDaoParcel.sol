pragma solidity >=0.6.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract CityDaoParcel is ERC721, Ownable, ERC721Tradable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => string) public parcelIdToTokenURI;
  mapping(uint256 => string) public parcelIdToPrice;

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  function listParcel(string memory tokenURI, string memory price) public onlyOwner returns (uint256) {
    uint256 parcelId = _tokenIds.current();
    _tokenIds.increment();
    parcelIdToTokenURI[parcelId] = tokenURI;
    parcelIdToPrice[parcelId] = price;

    return parcelId;
  }

  function mintItem(address _toAddress, uint256 parcelId)
      public
      onlyOwner
      returns (uint256)
  {
      _safeMint(_toAddress, parcelId);
      _setTokenURI(parcelId, parcelIdToTokenURI[parcelId]);

      return parcelId;
  }

  function getListedParcels() public view returns (mapping(uint256 => string)) {
    return parcelIdToTokenURI;
  }
}

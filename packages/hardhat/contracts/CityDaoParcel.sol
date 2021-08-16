pragma solidity >=0.6.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract CityDaoParcel is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => address) public parcelIdToOwners;
  mapping(uint256 => Parcel) public parcelIdToParcels;

  constructor() public ERC721("CityDaoParcel", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  struct Parcel {
        uint16 leaseLength;
        string metadataLocationHash;
  }

  function transferParcel(
        address _toAddress,
        address _fromAddress,
        uint256 _parcelId
    ) public {
        safeTransferFrom(_toAddress, _fromAddress, _parcelId);
        parcelIdToOwners[_parcelId] = _toAddress;
  }

  function mintItem(address _toAddress, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {
      uint256 parcelId = _tokenIds.current();
      _tokenIds.increment();
      parcelIdToOwners[parcelId] = _toAddress;
      _safeMint(_toAddress, parcelId);
      _setTokenURI(parcelId, tokenURI);

      return parcelId;
  }

  function getParcelOwner(uint256 _parcelId) external view returns (address) {
      return parcelIdToOwners[_parcelId];
  }
}

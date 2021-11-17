pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// /**
//  * @dev Interface of the ERC165 standard, as defined in the
//  * https://eips.ethereum.org/EIPS/eip-165[EIP].
//  *
//  * Implementers can declare support of contract interfaces, which can then be
//  * queried by others ({ERC165Checker}).
//  *
//  * For an implementation, see {ERC165}.
//  */
// interface IERC165 {
//     /**
//      * @dev Returns true if this contract implements the interface defined by
//      * `interfaceId`. See the corresponding
//      * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
//      * to learn more about how these ids are created.
//      *
//      * This function call must use less than 30 000 gas.
//      */
//     function supportsInterface(bytes4 interfaceId) external view returns (bool);
// }
// abstract contract ERC165 is IERC165 {
//     /**
//      * @dev See {IERC165-supportsInterface}.
//      */
//     function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
//         return interfaceId == type(IERC165).interfaceId;
//     }
// }

/**
 * EIP-2981
 */
interface IEIP2981 is IERC165 {
    /**
     * bytes4(keccak256("royaltyInfo(uint256,uint256)")) == 0x2a55205a
     *
     * => 0x2a55205a = 0x2a55205a
     */
    function royaltyInfo(uint256 tokenId, uint256 value)
        external
        view
        returns (address, uint256);
}

contract CityDaoParcel is ERC165, ERC721URIStorage, Ownable, IEIP2981 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address private _citizenNftContract;
  uint256[] private _citizenNftIds;
  struct TokenRoyalty {
      address recipient;
      uint16 bps;
  }
  TokenRoyalty public defaultRoyalty;

  mapping(uint256 => bool) private _citizenWhitelist;
  mapping(address => bool) private _addressWhitelist;
  mapping(uint256 => bool) private _plotIdToSoldStatus;
  mapping(uint256 => uint) private _plotIdToPrice;
  mapping(uint256 => string) private _plotIdToMetadata;

  // The owner of an NFT with the given plot ID holds a lifetime lease of the land plot designated in the plotMetadata found at the plotMetadataUri.
  // The plots are meant for conservation purposes only and must be kept in their current state unless specified in another CityDAO contract.
  // The owner of a plot NFT will also be granted one governance vote in proposals involving the communal land designated in the communalLandMetadata found at the communalLandMetadataUri.
  uint256[] private _plotIds = new uint256[](0);

  // The plot metadata marks the bounding area of each plot. 
  // The plot metadata's order matches the order of the plot ids array. 
  // For example, the first plot metadata is for the first plot id in the array.
  string private plotsMetadataUri;
  string private parcelMetadataUri;

  // The communal land metadata marks the bounding area of the communal land.
  // This land is owned by CityDAO LLC and is to be governed by the holders of the plot NFTs minted in this contract.
  string private communalLandMetadataUri;

  constructor() ERC721("CityDAO Parcel 0", "PRCL0") {
    _tokenIds.increment(); // reserve 0 for "no plot" id
  }

  function withdraw(uint amount, address payable _to) public onlyOwner returns(bool) {
      require(amount <= address(this).balance);
      _to.transfer(amount);
      return true;
  }

  function createPlot(uint256 price, string memory plotUri) public onlyOwner returns (uint256) {
    uint256 plotId = _tokenIds.current();
    _tokenIds.increment();
    _plotIdToPrice[plotId] = price;
    _plotIdToSoldStatus[plotId] = false;
    _plotIdToMetadata[plotId] = plotUri;
    _plotIds.push(plotId);

    return plotId;
  }

  function setParcelMetadata(string memory uri) public onlyOwner {
    parcelMetadataUri = uri;
  }

  function setPlotsMetadata(string memory uri) public onlyOwner {
    plotsMetadataUri = uri;
  }

  function getParcelMetadataUri() public view returns (string memory) {
    return parcelMetadataUri;
  }

  function getPlotsMetadataUri() public view returns (string memory) {
    return plotsMetadataUri;
  }

  function setCommunalLandMetadata(string memory uri) public onlyOwner {
    communalLandMetadataUri = uri;
  }
  function getCommunalLandMetadataUri() public view returns (string memory) {
    return communalLandMetadataUri;
  }

  function buyPlot(uint256 plotId)
      payable
      public
      returns (uint256)
  {
      require(isWhitelisted(msg.sender), "You don\'t have the right citizen NFT to buy this plot yet.");
      require(!isSold(plotId), "This plot has already been sold!");
      uint256 _price = _plotIdToPrice[plotId];
      require(msg.value == _price, "You must pay the price of the plot!");

      _safeMint(msg.sender, plotId);
      _setTokenURI(plotId, _plotIdToMetadata[plotId]);

      delete _plotIdToPrice[plotId];
      _plotIdToSoldStatus[plotId] = true;

      return plotId;
  }

  /// @notice Withdraw the funds locked in the smart contract,
  /// Can only becalled by the owner of the smart contract.
  function withdraw() external onlyOwner {
      uint256 amount = address(this).balance;
      (bool success, ) = owner().call{value: amount}("");
      require(success, "Failed to withdraw");
  }

  /// @dev Define the default amount of fee and receive address
  /// @param recipient address ID account receive royalty
  /// @param bps uint256 amount of fee (1% == 100)
  function setRoyalty(address recipient, uint16 bps)
      public
      onlyOwner
  {
      defaultRoyalty = TokenRoyalty(recipient, bps);
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      virtual
      override(ERC165, IERC165, ERC721)
      returns (bool)
  {
      return
          interfaceId == type(IEIP2981).interfaceId ||
          super.supportsInterface(interfaceId);
  }

  /// @dev Returns royalty info (address to send fee, and fee to send)
  /// @param tokenId uint256 ID of the token to display information
  /// @param value uint256 sold price
  function royaltyInfo(uint256 tokenId, uint256 value)
      public
      view
      override
      returns (address, uint256)
  {
      if (defaultRoyalty.recipient != address(0) && defaultRoyalty.bps != 0) {
          return (
              defaultRoyalty.recipient,
              (value * defaultRoyalty.bps) / 10000
          );
      }
      return (address(0), 0);
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

  function getTokenMetadataUri(uint256 tokenId) public view returns (string memory) {
    return _plotIdToMetadata[tokenId];
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

  function setCitizenNftContract(address nftContract) public onlyOwner {
    _citizenNftContract = nftContract;
  }

  function setCitizenNftIds(uint256[] memory ids) public onlyOwner {
    _citizenNftIds = ids;
  }

  function whitelistNft(uint256 citizenId, bool whitelisted) public onlyOwner {
    _citizenWhitelist[citizenId] = whitelisted;
  }

  function whitelistAddress(address addr, bool whitelisted) public onlyOwner {
    _addressWhitelist[addr] = whitelisted;
  }

  function isWhitelisted(address sender) public view returns (bool) {
    if (_addressWhitelist[sender]) {
      return true;
    }
    require(_citizenNftContract != address(0), "Citizen NFT contract not set!");
    require(_citizenNftIds.length > 0, "No citizen NFTs have been set yet.");
    IERC1155 citizenNft = IERC1155(_citizenNftContract);
    bool whitelisted = false;
    for (uint i = 0; i < _citizenNftIds.length; i++) {
      uint256 _citizenNftId = _citizenNftIds[i];
      if ( _citizenWhitelist[_citizenNftId] && citizenNft.balanceOf(sender, _citizenNftId) > 0) {
        whitelisted = true;
        break;
      }
    }
    return whitelisted;
  }
}

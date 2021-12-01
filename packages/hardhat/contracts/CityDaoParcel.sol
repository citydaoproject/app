pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

/// @title CityDAO Parcel 0
/// @author @gregfromstl
contract CityDaoParcel is ERC165, ERC721URIStorage, Ownable, IEIP2981 {

  // Counter to increment plot (token) IDs
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // The citizen NFT contract and its corresponding token IDs. A token must be listed in the _citizenNftIds in order to be whitelisted.
  address private _citizenNftContract;
  uint256[] private _citizenNftIds;

  // Implementing EIP2981 for royalties
  struct TokenRoyalty {
      address recipient;
      uint16 bps;
  }
  TokenRoyalty public defaultRoyalty;

  // In order to mint a token, the caller must either be a whitelisted address or posses a whitelisted citizen NFT.
  // List of whitelisted citizen NFT IDs
  mapping(uint256 => bool) private _citizenWhitelist;
  // List of whitelisted wallet addresses
  mapping(address => bool) private _addressWhitelist;

  // Maps the plot ID to the sold (minted) status of the plot (true = sold, false = not sold)
  mapping(uint256 => bool) private _plotIdToSoldStatus;

  // Maps the plot to its listed mint price
  mapping(uint256 => uint) private _plotIdToPrice;

  // Maps the plot ID to its corresponding metadata URI
  mapping(uint256 => string) private _plotIdToMetadata;

  // The owner of an NFT with the given plot ID holds a lifetime lease of the land plot designated in the plotMetadata found at the plotMetadataUri.
  // The plots are meant for conservation purposes only and must be kept in their current state unless specified in another CityDAO contract.
  // The owner of a plot NFT will also be granted one governance vote in proposals involving the communal land designated in the communalLandMetadata found at the communalLandMetadataUri.
  uint256[] private _plotIds = new uint256[](0);

  // The plot metadata marks the bounding area of each plot. 
  // The plot metadata's order matches the order of the plot ids array. 
  // For example, the first plot metadata is for the first plot id in the array.
  string private plotsMetadataUri;

  // The parcel metadata marks the bounding area of the entire parcel.
  string private parcelMetadataUri;

  // The communal land metadata marks the bounding area of the communal land.
  // This land is owned by CityDAO LLC and is to be governed by the holders of the plot NFTs minted in this contract.
  string private communalLandMetadataUri;

  // Sent whenever a plot is initially purchased and minted
  event PlotMinted(address, uint256);
  // Emitted whenever a plot is first created and listed for sale
  event PlotCreated(uint256);
  // Emitted whenever a series of addresses are whitelisted
  event WhitelistedAddress(address[]);
  // Emitted whenever the plots metadata is updated
  event PlotsMetadataUpdated(string);
  // Emitted whenever the communal land metadata is updated
  event CommunalLandMetadataUpdated(string);
  // Emitted whenever the parcel metadata is updated
  event ParcelMetadataUpdated(string);
  // Emitted whenever the citizen NFT contract is set
  event CitizenNftContractSet(address);
  // Emitted whenever the citizen NFT IDs are set
  event CitizenNftIdsSet(uint256[]);
  // Emmited whenever the citizen NFTs are whitelisted
  event CitizenNftWhitelisted(uint256);
  // Emitted whenever eth is deposited into the contract from an address
  event LogEthDeposit(address);
  // Emitted whenever the an amount is withdrawn from the contract
  event LogEthWithdrawal(address, uint256);
  // Emitted whenever the token royalty is set
  event DefaultRoyaltySet(address recipient, uint16 bps);

  /**
  * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
  */
  constructor() ERC721("CityDAO Parcel 0", "PRCL0") {
    _tokenIds.increment(); // reserve 0 for "no plot" id
  }

  fallback() external payable {
    emit LogEthDeposit(msg.sender);
  }

  receive() external payable {
    emit LogEthDeposit(msg.sender);
  }

  /**
  * @notice Withdraws from the contract's balance to the owner's address.
  *   Can only be called by the owner of the smart contract.
  * @dev Will revert if the contract's balance is less than the requested amount.
  *   Will return true if successfully withdrawn, otherwise throws.
  * @param amount The amount to withdraw (in wei)
  */
  function withdraw(uint amount) public onlyOwner returns(bool) {
      require(amount <= address(this).balance, "The contract's balance is less than the requested amount");
      (bool success, ) = owner().call{value: amount}("");
      require(success, "Failed to withdraw funds");
      emit LogEthWithdrawal(msg.sender, amount);
      return success;
  }

  /**
  * @notice creates a batch of plots
  * @param prices The price of each plot (in wei)
  * @param plotUris The metadata uri of each plot
  */
  function batchCreatePlots(uint256[] memory prices, string[] memory plotUris) public onlyOwner returns (uint256[] memory) {
    require(prices.length == plotUris.length, "The number of prices and plotUris must match");
    uint256[] memory plotIds = new uint256[](prices.length);
    for (uint i = 0; i < prices.length; i++) {
      plotIds[i] = createPlot(prices[i], plotUris[i]);
    }
    return plotIds;
  } 

  /**
  * @notice Creates a new plot eligible to be sold.
  *   Can only be called by the owner of the smart contract.
  * @dev Sets the plots price, sold status (false), and metadata URI.
  *   The plot URI is not added because the plot is not yet minted. It is added in buyPlot.
  *   Metadata must contain a valid geojson object designating the plot area.
  * @param price The mind price of the plot (in wei)
  * @param plotUri The URI of the plot's metadata
  */
  function createPlot(uint256 price, string memory plotUri) public onlyOwner returns (uint256) {
    uint256 plotId = _tokenIds.current();
    _tokenIds.increment();
    _plotIdToPrice[plotId] = price;
    _plotIdToSoldStatus[plotId] = false;
    _plotIdToMetadata[plotId] = plotUri;
    _plotIds.push(plotId);

    emit PlotCreated(plotId);

    return plotId;
  }

  /**
  * @notice Sets overarching parcel metadata uri.
  *   Can only be called by the owner of the smart contract.
  * @param uri The uri of the parcel metadata. The metadata must contain a valid geojson object with the "features" key changed to "parcel".
  */
  function setParcelMetadata(string memory uri) public onlyOwner {
    parcelMetadataUri = uri;
    emit ParcelMetadataUpdated(uri);
  }
  /**
  * @notice Gets overarching parcel metadata uri. The metadata will contain a valid geojson object with the "features" key changed to "parcel"
  */
  function getParcelMetadataUri() public view returns (string memory) {
    return parcelMetadataUri;
  }

  /**
  * @notice sets geojson metadata for all plots.
  *   Can only be called by the owner of the smart contract.
  * @dev The uri's metadata must contain a geojson object with the "features" key changed to "plots".
  *   The "plots" value should be an array of geojson polygons.
  * @param uri The uri of the plot metadata
  */
  function setPlotsMetadata(string memory uri) public onlyOwner {
    plotsMetadataUri = uri;
    emit PlotsMetadataUpdated(uri);
  }
  /**
  * @notice Gets all plots metadata uri.
  * @dev The uri's metadata should contain a geojson object with the "features" key changed to "plots".
  *   The "plots" value should be an array of geojson polygons.
  */
  function getPlotsMetadataUri() public view returns (string memory) {
    return plotsMetadataUri;
  }

  /**
  * @notice sets geojson metadata for the communal land area.
  *   Can only be called by the owner of the smart contract.
  * @dev The uri's metadata must contain a geojson object with the "features" key.
  * @param uri The uri of the plot metadata
  */
  function setCommunalLandMetadata(string memory uri) public onlyOwner {
    communalLandMetadataUri = uri;
    emit CommunalLandMetadataUpdated(uri);
  }
  /**
  * @notice sets geojson metadata for the communal land area.
  * @dev The uri's metadata will contain a geojson object with the "features" key.
  */
  function getCommunalLandMetadataUri() public view returns (string memory) {
    return communalLandMetadataUri;
  }

  /**
  * @notice purchases and mints the specified plot.
  * @dev The sender must be whitelisted by address or posses a whitelisted citizen NFT. The plot must have a false sold status. The message must contain the exact price of the plot in its value field.
  *   The price of the plot can be retrieved by calling getPrice. The status of all plots can be found by calling getAllSoldStatus and aligning with getPlotIds.
  * @param plotId The ID of the plot to be purchased.
  */
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

      emit PlotMinted(msg.sender, plotId);

      return plotId;
  }

  /**
  * @notice Define the default amount of fee and receive address
  * @param recipient address ID account receive royalty
  * @param bps uint256 amount of fee (1% == 100)
  */
  function setRoyalty(address recipient, uint16 bps)
      public
      onlyOwner
  {
      defaultRoyalty = TokenRoyalty(recipient, bps);
      emit DefaultRoyaltySet(recipient, bps);
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

  /**
  * @notice Returns royalty info (address to send fee, and fee to send)
  * @param tokenId uint256 ID of the token to display information
  * @param value uint256 sold price
  */
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

  /**
  * @notice Returns the sold status of the specified plot.
  * @param plotId uint256 ID of the token (plot) to get sold status for.
  */
  function isSold(uint256 plotId) public view returns (bool) {
    return _plotIdToSoldStatus[plotId];
  }

  /**
  * @notice Returns the price of the specified plot (in Gwei).
  * @param plotId uint256 ID of the token (plot) to get price for.
  */
  function getPrice(uint256 plotId) public view returns (uint) {
    return _plotIdToPrice[plotId];
  }


  function getTokenMetadataUri(uint256 tokenId) public view returns (string memory) {
    return _plotIdToMetadata[tokenId];
  }

  /**
  * @notice Returns the list of plot IDs
  * @dev The plot IDs are returned in the same order as the sold status (setAllSoldStatus), owners (getOwners), and prices (getAllPrices). This enables coordinating between the plot IDs and their sold status / price / owner.
  */
  function getPlotIds() public view returns (uint256[] memory) {
    return _plotIds;
  }

  /**
  * @notice Returns the list owners in the order corresponding to getPlotIds
  * @dev Returns the 0 address for plots that have not yet been sold (minted).
  */
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

  /**
  * @notice Returns the list of prices in the order corresponding to getPlotIds
  * @dev Returns the mint price regardless of sold status.
  */
  function getAllPrices() public view returns (uint256[] memory) {
    uint256[] memory ret = new uint256[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
        ret[i] = _plotIdToPrice[_plotIds[i]];
    }
    return ret;
  }

  /**
  * @notice Returns the list of sold statuses (as a boolean) in the order corresponding to getPlotIds
  */
  function getAllSoldStatus() public view returns (bool[] memory) {
    bool[] memory ret = new bool[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
        ret[i] = _plotIdToSoldStatus[_plotIds[i]];
    }
    return ret;
  }

  /**
  * @notice Sets the citizen NFT contract address and NFT IDs, which will be used for citizen whitelisting.
  * @param nftContract address The address of the citizen NFT contract.
  */
  function setCitizenNftContract(address nftContract, uint256[] memory nftIds) public onlyOwner {
    _citizenNftContract = nftContract;
    setCitizenNftIds(nftIds);
    emit CitizenNftContractSet(nftContract);
  }

  /**
  * @notice Sets the citizen NFT IDs
  * @dev In order to whitelist a citizen NFT, the ID must first be added here
  */
  function setCitizenNftIds(uint256[] memory ids) public onlyOwner {
    _citizenNftIds = ids;
    emit CitizenNftIdsSet(ids);
  }

  /**
  * @notice Sets the whitelist status for an NFT of the set _citizenNftContract.
  * @dev setCitizenNftIds must be called with the ID to whitelist before this function can be called.
  * @param citizenId uint256 The ID of the NFT to whitelist.
  * @param whitelisted bool Whether or not the NFT is whitelisted.
  */
  function whitelistNft(uint256 citizenId, bool whitelisted) public onlyOwner {
    bool idExists = false;
    for (uint i = 0; i < _citizenNftIds.length; i++) {
      uint256 _citizenNftId = _citizenNftIds[i];
      if (_citizenNftId == citizenId) {
        idExists = true;
        break;
      }
    }
    require(idExists, "Citizen NFT ID has not been set with setCitizenNftIds");
    _citizenWhitelist[citizenId] = whitelisted;
    emit CitizenNftWhitelisted(citizenId);
  }

  /**
  * @notice Whitelists a list of addresses.
  * @param _addresses address[] The ID of the NFT to whitelist.
  * @param whitelisted bool Whether or not the addresses are whitelisted.
  */
  function whitelistAddresses(address[] memory _addresses, bool whitelisted) public onlyOwner {
    for (uint i = 0; i < _addresses.length; i++) {
      _addressWhitelist[_addresses[i]] = whitelisted;
    }
    emit WhitelistedAddress(_addresses);
  }

  /**
  * @notice Checks if a an address is whitelisted and possesses a whitelisted citizen NFT.
  * @dev The _citizenNftContract must be set to check for whitelisted citizen NFTs. The _citizenNftIds must be set to check for whitelisted citizen NFTs. The address must be whitelisted AND possess a whitelisted NFT to pass.
  * A standard citizen is no longer whielisted once they have two plots. A founding or first citizen can have up to five plots.
  * @param sender address The address to check the whitelist status of.
  */
  function isWhitelisted(address sender) public view returns (bool) {
    require(_citizenNftContract != address(0), "Citizen NFT contract not set!");
    require(_citizenNftIds.length > 0, "No citizen NFTs have been set yet.");
    IERC1155 citizenNft = IERC1155(_citizenNftContract);
    bool whitelisted = false;
    for (uint i = 0; i < _citizenNftIds.length; i++) {
      uint256 _citizenNftId = _citizenNftIds[i];
      if ( _citizenWhitelist[_citizenNftId] && citizenNft.balanceOf(sender, _citizenNftId) > 0) {
        if (_addressWhitelist[sender] && _citizenNftId == 42 && balanceOf(sender) < 2) {
          whitelisted = true;
        } else if (_citizenNftId != 42 && balanceOf(sender) < 5) {
          whitelisted = true;
        }
        break;
      }
    }
    return whitelisted;
  }
}

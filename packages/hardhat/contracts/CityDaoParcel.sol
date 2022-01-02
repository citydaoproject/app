pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

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
contract CityDaoParcel is ERC165, ERC721URIStorage, Ownable, IEIP2981, VRFConsumerBase, ReentrancyGuard {

  // Counter to increment plot (token) IDs
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // The citizen NFT contract
  address private _citizenNftContract;

  // Implementing EIP2981 for royalties
  struct TokenRoyalty {
      address recipient;
      uint16 bps;
  }
  TokenRoyalty public defaultRoyalty;

  // For Chainlink VRF, see https://docs.chain.link/docs/get-a-random-number/
  bytes32 internal keyHash;
  uint256 internal fee;
  uint256 public randomResult;

  // List of wallet addresses with the amount of NFTs they can purchase
  mapping(address => uint256) private _whitelistedAmounts;
  address[] private _enteredAddresses;
  bool private _allowWhitelisting = false;

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
  // Emitted whenever an address is whitelisted
  event WhitelistedAddress(address);
  // Emitted whenever the plots metadata is updated
  event PlotsMetadataUpdated(string);
  // Emitted whenever the communal land metadata is updated
  event CommunalLandMetadataUpdated(string);
  // Emitted whenever the parcel metadata is updated
  event ParcelMetadataUpdated(string);
  // Emitted whenever the citizen NFT contract is set
  event CitizenNftContractSet(address);
  // Emitted whenever eth is deposited into the contract from an address
  event LogEthDeposit(address);
  // Emitted whenever the an amount is withdrawn from the contract
  event LogEthWithdrawal(address, uint256);
  // Emitted whenever the token royalty is set
  event DefaultRoyaltySet(address recipient, uint16 bps);
  // Emitted when raffle is entered
  event EnteredRaffle(address);

  /**
  * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
  */
  constructor()
  ERC721("CityDAO Parcel 0", "PRCL0")
  VRFConsumerBase(
      0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
      0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
  ) {
    _tokenIds.increment(); // reserve 0 for "no plot" id
    keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
  }

  fallback() external payable {
    emit LogEthDeposit(msg.sender);
  }

  receive() external payable {
    emit LogEthDeposit(msg.sender);
  }

  function configVRF(bytes32 _keyHash, uint256 _fee) external onlyOwner {
    keyHash = _keyHash;
    fee = _fee;
  }

  /**
  * Requests randomness
  */
  function getRandomNumber() internal returns (bytes32 requestId) {
      require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with at least 2 LINK (mainnet)");
      return requestRandomness(keyHash, fee);
  }
  function expand(uint256 randomValue, uint256 n) public pure returns (uint256[] memory expandedValues) {
      expandedValues = new uint256[](n);
      for (uint256 i = 0; i < n; i++) {
          expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
      }
      return expandedValues;
  }
  /**
  * Callback function used by VRF Coordinator
  */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
      randomResult = randomness;
  }
  /**
  * Get random numbers from Chainlink VRF (run getRandomNumber() first)
  */
  function drawRaffle(uint256 n) external onlyOwner {
    getRandomNumber();
    uint256[] memory winners = expand(randomResult, n);
    for (uint256 i = 0; i < n; i++) {
      address winner = _enteredAddresses[winners[i] % _enteredAddresses.length];
      _whitelistedAmounts[winner] = _whitelistedAmounts[winner] + 1;
      emit WhitelistedAddress(winner);
    }
  }

  function enteredRaffle(address _address) external view returns (bool) {
    for (uint256 i = 0; i < _enteredAddresses.length; i++) {
      if (_enteredAddresses[i] == _address) {
        return true;
      }
    }
    return false;
  }

  /**
  * @notice Withdraws from the contract's balance to the owner's address.
  *   Can only be called by the owner of the smart contract.
  * @dev Will revert if the contract's balance is less than the requested amount.
  *   Will return true if successfully withdrawn, otherwise throws.
  * @param amount The amount to withdraw (in wei)
  */
  function withdraw(uint amount) external onlyOwner returns(bool) {
      require(amount <= address(this).balance, "The contract's balance is less than the requested amount");
      (bool success, ) = owner().call{value: amount}("");
      require(success, "Failed to withdraw funds");
      emit LogEthWithdrawal(msg.sender, amount);
      return success;
  }

  /**
  * @notice Creates a new plot eligible to be sold.
  *   Can only be called by the owner of the smart contract.
  * @dev Sets the plots price, sold status (false), and metadata URI.
  *   The plot URI is not added because the plot is not yet minted. It is added in buyPlot.
  *   Metadata must contain a valid geojson object designating the plot area.
  * @param price The mint price of the plot (in wei)
  * @param plotUri The URI of the plot's metadata
  */
  function createPlot(uint256 price, string calldata plotUri) external onlyOwner returns (uint256) {
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
  function setParcelMetadata(string calldata uri) external onlyOwner {
    parcelMetadataUri = uri;
    emit ParcelMetadataUpdated(uri);
  }
  /**
  * @notice Gets overarching parcel metadata uri. The metadata will contain a valid geojson object with the "features" key changed to "parcel"
  */
  function getParcelMetadataUri() external view returns (string memory) {
    return parcelMetadataUri;
  }

  /**
  * @notice sets geojson metadata for all plots.
  *   Can only be called by the owner of the smart contract.
  * @dev The uri's metadata must contain a geojson object with the "features" key changed to "plots".
  *   The "plots" value should be an array of geojson polygons.
  * @param uri The uri of the plot metadata
  */
  function setPlotsMetadata(string calldata uri) external onlyOwner {
    plotsMetadataUri = uri;
    emit PlotsMetadataUpdated(uri);
  }
  /**
  * @notice Gets all plots metadata uri.
  * @dev The uri's metadata should contain a geojson object with the "features" key changed to "plots".
  *   The "plots" value should be an array of geojson polygons.
  */
  function getPlotsMetadataUri() external view returns (string memory) {
    return plotsMetadataUri;
  }

  /**
  * @notice sets geojson metadata for the communal land area.
  *   Can only be called by the owner of the smart contract.
  * @dev The uri's metadata must contain a geojson object with the "features" key.
  * @param uri The uri of the plot metadata
  */
  function setCommunalLandMetadata(string calldata uri) external onlyOwner {
    communalLandMetadataUri = uri;
    emit CommunalLandMetadataUpdated(uri);
  }
  /**
  * @notice sets geojson metadata for the communal land area.
  * @dev The uri's metadata will contain a geojson object with the "features" key.
  */
  function getCommunalLandMetadataUri() external view returns (string memory) {
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
      external
      nonReentrant
      returns (uint256)
  {
      require(_whitelistedAmounts[msg.sender] > 0, "You have purchased all your whitelisted plots.");
      require(!isSold(plotId), "This plot has already been sold!");
      require(msg.value == _plotIdToPrice[plotId], "You must pay the price of the plot!");
      _whitelistedAmounts[msg.sender] = _whitelistedAmounts[msg.sender] - 1;
      delete _plotIdToPrice[plotId];
      _plotIdToSoldStatus[plotId] = true;
      _setTokenURI(plotId, _plotIdToMetadata[plotId]);

      _safeMint(msg.sender, plotId);
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
  * @param _tokenId uint256 ID of the token to display information
  * @param _salePrice uint256 sold price
  */
  function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
      public
      view
      override
      returns (address receiver, uint256 royaltyAmount)
  {
      if (defaultRoyalty.recipient != address(0) && defaultRoyalty.bps != 0) {
          return (
              defaultRoyalty.recipient,
              (_salePrice * defaultRoyalty.bps) / 10000
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
  function getPrice(uint256 plotId) external view returns (uint) {
    return _plotIdToPrice[plotId];
  }


  function getTokenMetadataUri(uint256 tokenId) external view returns (string memory) {
    return _plotIdToMetadata[tokenId];
  }

  /**
  * @notice Returns the list of plot IDs
  * @dev The plot IDs are returned in the same order as the sold status (setAllSoldStatus), owners (getOwners), and prices (getAllPrices). This enables coordinating between the plot IDs and their sold status / price / owner.
  */
  function getPlotIds() external view returns (uint256[] memory) {
    return _plotIds;
  }

  /**
  * @notice Returns the list owners in the order corresponding to getPlotIds
  * @dev Returns the 0 address for plots that have not yet been sold (minted).
  */
  function getOwners() external view returns (address[] memory) {
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
  function getAllPrices() external view returns (uint256[] memory) {
    uint256[] memory ret = new uint256[](_plotIds.length);
    for (uint i = 0; i < _plotIds.length; i++) {
        ret[i] = _plotIdToPrice[_plotIds[i]];
    }
    return ret;
  }

  /**
  * @notice Returns the list of sold statuses (as a boolean) in the order corresponding to getPlotIds
  */
  function getAllSoldStatus() external view returns (bool[] memory) {
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
  function setCitizenNftContract(address nftContract) external onlyOwner {
    _citizenNftContract = nftContract;
    emit CitizenNftContractSet(nftContract);
  }

  function beginWhitelisting() external onlyOwner {
    _allowWhitelisting = true;
  }
  function endWhitelisting() external onlyOwner {
    _allowWhitelisting = false;
  }
  function isWhitelisting() external view returns (bool) {
    return _allowWhitelisting;
  }

  function getWhitelistedAmount(address addr) external view returns (uint256) {
    return _whitelistedAmounts[addr];
  }

  function enterRaffle() external {
    require(_allowWhitelisting, "Whitelisting is disabled");
    require(_citizenNftContract != address(0), "Citizen NFT contract not set!");
    IERC1155 citizenNft = IERC1155(_citizenNftContract);

    if (citizenNft.balanceOf(msg.sender, 42) > 0) { // has citizen NFT
      _whitelistedAmounts[msg.sender] = 0;
      _enteredAddresses.push(msg.sender);
      emit EnteredRaffle(msg.sender);
    } else {
      revert("You must have a standard citizen NFT to enter the raffle");
    }
  }

  /**
  * @notice Whitelists a list of addresses.
  * @param _addresses address[] The ID of the NFT to whitelist.
  * @param amount uint256 The number of plots the address can purchase
  */
  function whitelistAddresses(address[] calldata _addresses, uint256 amount) external onlyOwner {
    for (uint i = 0; i < _addresses.length; i++) {
      _whitelistedAmounts[_addresses[i]] = amount;
      emit WhitelistedAddress(_addresses[i]);
    }
  }
}

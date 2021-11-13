pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CitizenNFT is
    ERC1155,
    Ownable
{
    // Internal Ids that are used to differentiate between the different Citizen NFTs
    uint256 private constant CITIZEN_NFT_ID = 42;
    uint256 private constant FOUNDING_NFT_ID = 69;
    uint256 private constant FIRST_NFT_ID = 7;

    /// @notice Initialise CitizenNFT smart contract with the appropriate address and ItemIds of the
    /// Open Sea shared storefront smart contract and the Citizen NFTs that are locked in it.
    constructor()
        ERC1155("")
    {

    }

    ///@notice Mint new citizenNFTs to an address, usually that of CityDAO.
    function issueNewCitizenships(
        address _to,
        uint256 _citizenType,
        uint256 _numberOfCitizens
    ) public onlyOwner {
        _mint(_to, _citizenType, _numberOfCitizens, "");
    }
}

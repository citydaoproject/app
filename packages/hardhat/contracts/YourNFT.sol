pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/utils/Counters.sol";

// OZ ERC721 docs: https://docs.openzeppelin.com/contracts/3.x/erc721
// opensea metadata standards: https://docs.opensea.io/docs/metadata-standards
// ipfs demo for scaffold-eth: https://github.com/austintgriffith/scaffold-eth/tree/ipfs-demo

contract YourNFT is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("YourNFT","YNFT" ) {
    _setBaseURI("https://yoursite.io/");
  }

  function mint(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newId = _tokenIds.current();
        _mint(to, newId);
        _setTokenURI(newId, tokenURI);

        return newId;
    }

}

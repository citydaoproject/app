pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

//example from: https://docs.openzeppelin.com/contracts/3.x/erc721
contract YourContract is ERC721{
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 startingPrice = 0.01 ether;
  uint256 num = 105;
  uint256 den = 100;
  mapping( string => uint256 ) public prices;

  event Mint(uint256 id, address to, string tokenURI, string color, string input);
  event Burn(uint256 id, string tokenURI);

  constructor() ERC721("YourNFT", "yNFT") public   {
    // what should we do on deploy?
  }

  function nextPrice(string memory tokenURI) public view returns(uint256){
    uint256 next = ((prices[tokenURI]*num)/den);
    if(next < startingPrice) next = startingPrice;
    return next;
  }

  function prevPrice(string memory tokenURI) public view returns(uint256) {
    uint256 next = ((prices[tokenURI]*den)/num);
    if(next < startingPrice) next = startingPrice;
    return next;
  }

  function anyoneCanMint(address to, string memory tokenURI, string memory color, string memory input)
        public
        payable
        returns (uint256)
    {
        uint256 priceToMint = nextPrice(tokenURI);
        prices[tokenURI] = priceToMint;
        require(msg.value == priceToMint,"NOT ENOUGH");
        prices[tokenURI] = priceToMint;

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit Mint(newItemId, to, tokenURI, color, input);
        return newItemId;
    }

  function burn(uint256 tokenId) public {

    string memory tokenURI = tokenURI(tokenId);
    
    uint256 price = prices[tokenURI];
    prices[tokenURI] = prevPrice(tokenURI);
    
    _burn(tokenId);
    msg.sender.transfer(price);

    emit Burn(tokenId, tokenURI);
  }

    //TODO ADD burn where you get
    // _burn(itemId)
    // figure out price
    // msg.sender.transfer ( price)
    //  prices[tokenURI] = prevPrice(tokenURI);
}

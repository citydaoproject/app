const EIP712 = require("./EIP712");

const ERC721Types = {
	Part: [
		{name: 'account', type: 'address'},
		{name: 'value', type: 'uint96'}
	],
	Mint721: [
		{name: 'tokenId', type: 'uint256'},
		{name: 'tokenURI', type: 'string'},
		{name: 'creators', type: 'Part[]'},
		{name: 'royalties', type: 'Part[]'}
	]
};

export async function sign(provider, chainId, contractAddress, form, account) {
	const data = EIP712.createTypeData({
    name: 'Mint721',
    version: '1',
    chainId,
    verifyingContract: contractAddress
  },
  'Mint721',
  {...form, tokenURI: form.uri},
  ERC721Types
  );
  console.log({data})
	return (await EIP712.signTypedData(provider, account, data)).sig;
}

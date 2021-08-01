import { utils } from "ethers";
import { sign } from "./lazyMint";

export async function generateTokenId(contract, minter) {
	console.log("generating tokenId for", contract, minter)
  const raribleTokenIdUrl = `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${contract}/generate_token_id?minter=${minter}`;
  const res = await fetch(raribleTokenIdUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  console.log({resJson})
	return resJson.tokenId
}

async function createLazyMintForm(tokenId, contract, minter, ipfsHash) {
  // const tokenId = await generateTokenId(contract, minter)
	console.log("generated tokenId", tokenId)
	return {
		"@type": "ERC721",
		contract: contract,
		tokenId: tokenId,
		uri: `/ipfs/${ipfsHash}`,
		creators: [{ account: minter, value: "10000" }],
		royalties: []
	}
}

export async function createLazyMint(tokenId, provider, contract, minter, ipfsHash) {
  const form = await createLazyMintForm(tokenId, contract, minter, ipfsHash)
  const signature = await sign(provider, 3, contract, form, minter)
	return { ...form, signatures: [signature] }
}

export async function putLazyMint(form) {
  const raribleMintUrl = "https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/mints"
  const raribleMintResult = await fetch(raribleMintUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  console.log({raribleMintResult})
}
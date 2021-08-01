import React from "react";
import { Button, Input, Card } from "antd";
import {AddressInput} from './'
import { createLazyMint, generateTokenId, putLazyMint } from "../rarible/createLazyMint";

export default function LazyMint(props) {
  const [contractAddress, setContractAddress] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState();
  const [tokenId, setTokenId] = React.useState();
  const [sending, setSending] = React.useState();
  console.log({writeContracts: props.writeContracts})
  return (
    <div>
      <Input
        value={ipfsHash}
        placeholder="IPFS Hash"
        onChange={e => {
          setIpfsHash(e.target.value);
        }}
      />
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          if (!props.writeContracts) return
          setSending(true);
          const newTokenId = await generateTokenId(props.writeContracts.ERC721Rarible.address, props.accountAddress)
          setTokenId(newTokenId)
          setContractAddress(props.writeContracts.ERC721Rarible.address)
          console.log("sending");
          const form = await createLazyMint(newTokenId, props.provider, props.writeContracts.ERC721Rarible.address, props.accountAddress, ipfsHash)
          await putLazyMint(form)
          setSending(false);
        }}
      >
        Mint
      </Button>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>Token ID: {tokenId}</span>
                          </div>
                        }
                      >
                        {/* <div>
                          <img src={item.image} style={{ maxWidth: 150 }} />
                        </div> */}
                        <div>
                          <p>Contract: {contractAddress}</p>
                        </div>
                      </Card>
    </div>
  );
}

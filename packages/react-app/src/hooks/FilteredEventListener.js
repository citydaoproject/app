import { useState, useEffect } from "react";

export default function useFilteredEventListener(contracts, contractName, filter, provider, startBlock, args, extraWatch) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (typeof provider !== "undefined" && typeof startBlock !== "undefined") {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contracts && contractName && contracts[contractName]) {
      try {
        contracts[contractName].on(filter, async (...args) => {
          let blockNumber = args[args.length-1].blockNumber
          let block = await provider.getBlock(blockNumber)
          let timestamp = block.timestamp
          setUpdates(messages => [Object.assign({blockNumber,timestamp},args.pop().args), ...messages]);
        });
        return () => {
          contracts[contractName].removeListener(filter);
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [ provider, contracts, contractName, extraWatch ]);

  return updates;
}

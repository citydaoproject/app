import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  YourContract,
  Mint,
  Burn
} from "../generated/YourContract/YourContract"
import { Haiku, Owner } from "../generated/schema"


export function storeMint(event: Mint): void {

  let ownerString = event.params.to.toHexString()

  let owner = Owner.load(ownerString)

  if (owner == null) {
    owner = new Owner(ownerString)
    owner.address = event.params.to
    owner.createdAt = event.block.timestamp
    owner.haikuCount = BigInt.fromI32(1)
  }
  else {
    owner.haikuCount = owner.haikuCount.plus(BigInt.fromI32(1))
  }

  let haiku = new Haiku(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  haiku.text = event.params.input
  haiku.owner = ownerString
  haiku.createdAt = event.block.timestamp
  haiku.transactionHash = event.transaction.hash.toHex()
  haiku.color = event.params.color
  haiku.tokenId = event.params.tokenURI

  haiku.save()
  owner.save()

}

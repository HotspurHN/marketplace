import { BigInt, log } from "@graphprotocol/graph-ts";
import { ethereum } from "@graphprotocol/graph-ts/chain/ethereum";
import {
  ItemBought as ItemBoughtEvent,
  ListingCancelled as ListingCancelledEvent,
  ListingCreated as ListingCreatedEvent,
  Marketplace as MarketplaceContract
} from "../generated/Marketplace/Marketplace"
import {
  Listing, Token, History
} from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  const listingResult = handleMarketplace(event, event.params.id);
  
  const token = Token.load(listingResult.tokenId.toString());
  if (token){
    token.listing = null;
    token.save();
  }
  handleMarketplaceHistory(event, event.params.id);
}

export function handleListingCancelled(event: ListingCancelledEvent): void {
  const listingResult = handleMarketplace(event, event.params.id);
  const token = Token.load(listingResult.tokenId.toString());
  if (token){
    token.listing = null;
    token.save();
  }
}

export function handleListingCreated(event: ListingCreatedEvent): void {
  const listingResult = handleMarketplace(event, event.params.id);
  const token = Token.load(listingResult.tokenId.toString());
  if (token){
    token.listing = listingResult.id;
    token.save();
  }
}

const handleMarketplace = (event: ethereum.Event, id: BigInt): Listing => {
  let entity = new Listing(
    id.toString()
  );
  let marketPlaceContract = MarketplaceContract.bind(event.address);
  const listing = marketPlaceContract.listings(id);

  entity.seller = listing.getSeller().toHexString();
  entity.price = listing.getPrice();
  entity.listTimestamp = listing.getTimestamp();
  entity.tokenId = listing.getTokenId();
  entity.token = listing.getTokenId().toString();
  entity.updatedAtTimestamp = event.block.timestamp;
  entity.isOpen = listing.getIsOpen();
  entity.sellerId = listing.getSeller().toHexString();
  entity.save()
  return entity;
}
const handleMarketplaceHistory = (event: ItemBoughtEvent, id: BigInt): History => {
  let entity = new History(
    id.toString()
  );
  let marketPlaceContract = MarketplaceContract.bind(event.address);
  const listing = marketPlaceContract.listings(id);

  entity.seller = listing.getSeller().toHexString();
  entity.buyer = event.params.to.toHexString();
  entity.price = listing.getPrice();
  entity.tokenId = listing.getTokenId();
  entity.token = listing.getTokenId().toString();
  entity.updatedAtTimestamp = event.block.timestamp;
  entity.sellerId = listing.getSeller().toHexString();
  entity.transactionType = 'transfer';
  entity.save()
  return entity;
}
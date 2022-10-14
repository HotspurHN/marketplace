import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer,
  Erc721my
} from "../generated/Erc721my/Erc721my"
import { Token, User, History } from "../generated/schema"
import { ipfs, json } from '@graphprotocol/graph-ts'

const setValue = function (t: Token, container: TypedMap<string, JSONValue>, key: string,
  callback: (t: Token, value: JSONValue, container?: TypedMap<string, JSONValue>) => void): void {
  const val = container.get(key);
  if (val && t) {
    callback(t, val, container);
  }
}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.params.tokenId.toString())
  if (!token) {
    token = new Token(event.params.tokenId.toString())
    token.tokenId = event.params.tokenId

    let tokenContract = Erc721my.bind(event.address);

    token.tokenURI = tokenContract.tokenURI(event.params.tokenId);

    let metadata = ipfs.cat(token.tokenURI || "");
    if (metadata) {
      const value = json.fromString(metadata.toString()).toObject();
      if (value) {
        setValue(token, value, "name", (t, val) => { t.name = val.toString() });
        setValue(token, value, "image", (t, val) => { t.image = val.toString().replace("ipfs://", "") });
        setValue(token, value, "description", (t, val) => { t.description = val.toString() });
        setValue(token, value, "attributes", (t, val) => {
          const attributesArray = val.toArray();
          for (let i = 0; i < attributesArray.length; i++) {
            const attribute = attributesArray[i].toObject();
            if (attribute) {
              setValue(t, attribute, "trait_type", (t, val, a) => {
                if (a) {
                  if (val.toString() == "Background") {
                    setValue(t, a, "value", (t, val) => {
                      t.background = val.toString()
                    });
                  }
                  else if (val.toString() == "Body") {
                    setValue(t, a, "value", (t, val) => {
                      t.body = val.toString()
                    });
                  }
                  else if (val.toString() == "Head") {
                    setValue(t, a, "value", (t, val) => {
                      t.head = val.toString()
                    });
                  }
                  else if (val.toString() == "Face") {
                    setValue(t, a, "value", (t, val) => {
                      t.face = val.toString()
                    });
                  }
                  else if (val.toString() == "Eyes") {
                    setValue(t, a, "value", (t, val) => {
                      t.eyes = val.toString()
                    });
                  }
                  else if (val.toString() == "Mouth") {
                    setValue(t, a, "value", (t, val) => {
                      t.mouth = val.toString()
                    });
                  }
                  else if (val.toString() == "Mask") {
                    setValue(t, a, "value", (t, val) => {
                      t.mask = val.toString();
                    });
                  }
                  else if (val.toString() == "Cloud") {
                    setValue(t, a, "value", (t, val) => {
                      t.cloud = val.toString();
                    });
                  }
                  else if (val.toString() == "Heart") {
                    setValue(t, a, "value", (t, val) => {
                      t.heart = val.toString();
                    });
                  }
                  else if (val.toString() == "Cry") {
                    setValue(t, a, "value", (t, val) => {
                      t.cry = val.toString();
                    });
                  }
                  else if (val.toString() == "Drop") {
                    setValue(t, a, "value", (t, val) => {
                      t.drop = val.toString();
                    });
                  }
                }
              });
            }
          }
        });

        token.ipfsURI = `ipfs.io/ipfs/${token.tokenURI}`;
      }
    }
    
    let history = new History(
      `mint${event.params.tokenId.toString()}`
    );
    history.seller = event.params.from.toHexString();
    history.buyer = event.params.to.toHexString();
    history.price = BigInt.fromString('0');
    history.tokenId = event.params.tokenId;
    history.token = event.params.tokenId.toString();
    history.updatedAtTimestamp = event.block.timestamp;
    history.sellerId = event.params.from.toHexString();
    history.transactionType = 'mint';
    history.save()
  }
  token.updatedAtTimestamp = event.block.timestamp;

  if (event.params.to.toHexString().toLowerCase() != '0x6C72FCE596aBab5db84470048Dc64d269787879C'.toLowerCase()) {
    token.owner = event.params.to.toHexString();
  }
  const user = new User(event.params.to.toHexString());
  const userFrom = new User(event.params.from.toHexString());

  token.save();
  user.save();
  userFrom.save();
}

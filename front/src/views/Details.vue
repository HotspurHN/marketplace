<template>
    <div class="details-container">
        <div class="item-metadata">
            <div class="item-wrapper" v-if="!!nft">
                <div class="item-image">
                    <img :src="`https://ipfs.io/ipfs/${nft.image}`" />
                </div>
                <div class="item-meta">
                    <div class="item-title">{{ nft.name }} #{{ nft.id }}</div>
                    <div class="item-description">{{ nft.description }}</div>

                    <div v-if="isApprovedForAll && nft && !nft.listing && nft && nft.owner.id == address"><input
                            type="text" v-model="price" /></div>
                    <div v-if="!!nft.listing">{{ $ethers.ethers.utils.formatEther(nft.listing.price) }} 🪙</div>

                    <div class="sell-button" v-if="!isApprovedForAll && nft && nft.owner.id == address"><button
                            @click="approve">Approve</button></div>
                    <div class="sell-button"
                        v-if="nft.listing && isApprovedErc20 - nft.listing.price < 0 && nft && nft.owner.id != address">
                        <button @click="approveErc20">Approve $Erc20my</button>
                    </div>
                    <div class="sell-button" v-if="isApprovedForAll && !nft.listing && nft && nft.owner.id == address">
                        <button @click="sell">Sell</button>
                    </div>
                    <div class="sell-button"
                        v-if="nft.listing && nft.listing.sellerId == address && nft && nft.owner.id == address"><button
                            @click="remove">Remove listing</button></div>
                    <div class="sell-button"
                        v-if="nft.listing && isApprovedErc20 - nft.listing.price >= 0 &&  nft.listing.sellerId != address && nft && nft.owner.id != address">
                        <button @click="buy">Buy</button>
                    </div>
                </div>
            </div>
            <div class="item-traits" v-if="!!nft">
                <ul>
                    <li><strong>Background Color:</strong> <span>{{ nft.background }} <div class="item-traits-color"
                                :style="{ 'background-color': nft.background }"></div></span>
                    </li>
                    <li><strong>Body Color:</strong> <span>{{ nft.body }} <div class="item-traits-color"
                                :style="{ 'background-color': nft.body }"></div></span>
                    </li>
                    <li><strong>Head Color:</strong> <span>{{ nft.head }} <div class="item-traits-color"
                                :style="{ 'background-color': nft.head }"></div></span>
                    </li>
                    <li><strong>Face Color:</strong> <span>{{ nft.face }} <div class="item-traits-color"
                                :style="{ 'background-color': nft.face }"></div></span>
                    </li>
                    <li><strong>Mouth variant:</strong> <span>{{ nft.mouth }} </span>
                    </li>
                    <li><strong>Mask:</strong> <span>{{ nft.mask == 1 }} </span>
                    </li>
                    <li><strong>Cloud:</strong> <span>{{ nft.cloud == 1 }} </span>
                    </li>
                    <li><strong>Heart:</strong> <span>{{ nft.heart == 1 }} </span>
                    </li>
                    <li><strong>Drop:</strong> <span>{{ nft.drop == 1 }} </span>
                    </li>
                    <li><strong>Cry:</strong> <span>{{ nft.cry == 1 }} </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="item-marketplace-data">
            <div class="item-wrapper history" v-if="!!nft">
                <div><strong>Owner: </strong>
                    <router-link class="item-title" :to="{ name: 'owner', params: { id: nft.owner.id } }">
                        {{nft.owner.id}}</router-link> <strong v-if="nft.owner.id == address">(You)</strong>
                </div>
            </div>
            <div class="item-wrapper history" v-if="!!history && history.length">
                <div><strong>History: </strong></div>
                <div v-for="h in history" :key="h.id">
                    <div v-if="h.transactionType == 'mint'">
                        📅 {{new Date(h.updatedAtTimestamp *1000 ).toLocaleString()}} | 🐣 mint
                        ➡️ <router-link class="item-title" :to="{ name: 'owner', params: { id: h.buyer.id } }">
                            {{shortAddress(h.buyer.id)}}</router-link>
                    </div>
                    <div v-if="h.transactionType != 'mint'">
                        📅 {{new Date(h.updatedAtTimestamp *1000 ).toLocaleString()}} | 🛒
                        <router-link class="item-title" :to="{ name: 'owner', params: { id: h.seller.id } }">
                            {{shortAddress(h.seller.id)}}</router-link>
                        ➡️ <router-link class="item-title" :to="{ name: 'owner', params: { id: h.buyer.id } }">
                            {{shortAddress(h.buyer.id)}}</router-link>
                        | {{$ethers.ethers.utils.formatEther(h.price)}} 🪙
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const getItem = async (self) => {
    const response = await fetch("https://api.thegraph.com/subgraphs/name/hotspurhn/mixort",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ "query": "{\n  token(id: \"" + self.$route.params.id + "\") {\n    id\n    tokenId\n    tokenURI\n    name\n    drop\n cry\n background\n body\n head\n face\n  eyes\n     mouth\n     mask\n     cloud\n     heart\n    description\n    owner{\n      id\n    }\n listing {price\nsellerId\nid}    image\n  }\n}\n", "variables": null })
        });

    const data = (await response.json()).data.token;
    self.nft = data;
}
const getHistory = async (self) => {
    const response = await fetch("https://api.thegraph.com/subgraphs/name/hotspurhn/mixort",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ "query": "{\n  histories(where: {tokenId: \"" + self.$route.params.id + "\"}){\n    id\n transactionType\n   price\n    seller{id}\n    buyer{id}\n updatedAtTimestamp}}\n", "variables": null })
        });

    const data = (await response.json()).data.histories;
    self.history = data;
}

let timer = null;

export default {
    name: 'ItemComponent',
    data() {
        return {
            nft: null,
            history: [],
            price: 0,
            isApprovedForAll: false,
            isApprovedErc20: 0,
            tokenId: 0,
            currentBlock: 0
        }
    },
    mounted: async function () {
        this.tokenId = this.$route.params.id;
        this.currentBlock = this.$ethers.getCurrentBlock();
        const self = this;

        const fn = async () => {
            const signer = await self.$ethers.getSigner();
            const address = await self.$ethers.getAddress();
            self.address = address.toLowerCase();
            if (signer && address) {
                self.isApprovedForAll = await (await self.$contracts.contracts.erc721()).isApprovedForAll(address, self.$contracts.address.marketplace);
                self.isApprovedErc20 = await (await self.$contracts.contracts.erc20()).allowance(address, self.$contracts.address.marketplace);
                await getItem(self);
                await getHistory(self);
            }
        };
        fn();
        timer = setInterval(fn, 10000);
    },
    methods: {
        sell: async function () {
            await (await this.$contracts.contracts.marketplace())["listItem(uint256,uint256)"](this.tokenId, this.$ethers.ethers.utils.parseEther(this.price));
        },
        remove: async function () {
            await (await this.$contracts.contracts.marketplace()).cancel(this.nft.listing.id);
        },
        buy: async function () {
            await (await this.$contracts.contracts.marketplace()).buyItem(this.nft.listing.id);
        },
        approve: async function () {
            await (await this.$contracts.contracts.erc721()).setApprovalForAll(this.$contracts.address.marketplace, true);
        },
        approveErc20: async function () {
            await (await this.$contracts.contracts.erc20()).approve(this.$contracts.address.marketplace, (await this.$contracts.contracts.erc20()).totalSupply());
        }
    },
    unmounted: async function () {
        if (timer) {
            clearInterval(timer);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.details-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.item-metadata {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 20px;

}

.item-marketplace-data {
    flex: 2;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 20px;
}

.item-wrapper,
.item-traits {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 10px;
    margin: 10px;
    width: 100%;
    box-sizing: border-box;
}

.item-wrapper:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.item-traits ul {
    list-style-type: none;
    padding: 0;
}

.item-image {
    width: 100%;
    border: 1px solid #ccc;
    padding: 5px;
    box-sizing: border-box;
}

.item-image img {
    width: 100%;
}

.item-meta {
    padding: 10px;
}

.item-title {
    font-weight: bold;
}

.history .item-title {
    font-weight: bold;
    color: #00baf7;
}

.item-description {
    font-size: 8px;
}

.item-traits-color {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #ccc;
}

.sell-button button {
    margin: 10px;
    margin-left: 0;
    color: white;
    background: #00baf7;
    border: 1px solid #004a87;
    border-radius: 3px;
    padding: 3px;
    cursor: pointer;
}
</style>

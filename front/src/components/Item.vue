<template>
    <div class="item-wrapper">
        <div class="item-image">
            <img :src="`https://ipfs.io/ipfs/${nft.image}`" />
        </div>
        <div class="item-meta">
            <router-link class="item-title" :to="{ name: 'details', params: { id: nft.meta.id } }">{{ nft.meta.name }} #{{ nft.meta.id }}</router-link>
            <div class="item-description">{{ nft.meta.description }}</div>
            <div v-if="nft.listed">{{ ethers.utils.formatEther(nft.price) }} 🪙</div>
            <div>{{ address }}</div>
        </div>
    </div>
</template>

<script>

import { ethers } from 'ethers';
export default {
    name: 'ItemComponent',
    data: function () {
        return {
            ethers: null
        };
    },
    computed: {
        address: function () {
            return this.shortAddress(this.nft.owner);
        }
    },
    props: {
        nft: Object
    },
    created: function () {
        this.ethers = ethers;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-wrapper {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 10px;
    margin: 10px;
    width: 120px;
    height: 200px;
}

.item-wrapper:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
    color: #00baf7;
}

.item-description {
    font-size: 8px;
}
</style>

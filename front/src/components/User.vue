<template>
    <div class="item-wrapper">
        <div class="item-meta">

            <div class="item-description">
                <router-link class="item-title" :to="{ name: 'owner', params: { id: user.id } }">
                    {{address}}</router-link>
            </div>
            <div>{{ user.count }} tokens</div>
        </div>
    </div>
</template>

<script>

import { ethers } from 'ethers';
export default {
    name: 'UserComponent',
    data: function () {
        return {
            ethers: null
        };
    },
    computed: {
        address: function () {
            return this.shortAddress(this.user.id);
        }
    },
    props: {
        user: Object
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
    width: 80px;
    height: 80px;
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

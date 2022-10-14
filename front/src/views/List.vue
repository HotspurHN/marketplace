<template>
  <div class="list">
    <ItemVue v-for="i in images" :key="i.id" :nft="i"></ItemVue>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import ItemVue from './../components/Item.vue';

const getItems = async (self) => {
  const response = await fetch("https://api.thegraph.com/subgraphs/name/hotspurhn/mixort",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ "query": "{\n  tokens(first: 100) {\n    id\nowner{id}\n    tokenId\n    tokenURI\n    name\nlisting\n{price}    description\n    image\n  }\n}\n", "variables": null })
    });

  const data = (await response.json()).data.tokens;
  self.images.push(...data.map(x => {
    return {
      meta: {
        id: x.id,
        tokenId: x.tokenId,
        tokenURI: x.tokenURI,
        name: x.name,
        description: x.description,
      },
      image: (x.image || "").replace('ipfs://', ''),
      id: x.id,
      owner: x.owner.id,
      listed: !!x.listing,
      price: x.listing?.price
    }
  }));
}

export default {
  name: 'ListComponent',
  components: {
    ItemVue
  },
  data() {
    return {
      items: [],
      images: [],
      ethers: null
    }
  },
  mounted: function () {
    this.ethers = ethers;
    getItems(this);
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>

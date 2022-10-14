<template>
  <header v-if="isCorrectNetwork">
    <div class="left">
      <a href="/">Mixort NFT Marketplace</a>
    </div>
    <div class="right">
      <button v-if="!address" @click="connect">Connect</button>
      <div v-if="!!address">Connected: {{ address }}</div>
      <div></div>
    </div>
  </header>
  <div class="clear"></div>
  <menu v-if="isCorrectNetwork">
    <menuitem>
    <router-link :to="{ name: 'list' }">List</router-link>
    </menuitem>
    <menuitem>
    <router-link :to="{ name: 'owners' }">Owners</router-link>
    </menuitem>
  </menu>
  <section v-if="isCorrectNetwork">
    <router-view></router-view>
  </section>
  <WrongNetworkVue v-if="!isCorrectNetwork" :network="network"></WrongNetworkVue>
</template>

<script>

import WrongNetworkVue from './components/WrongNetwork.vue';
export default {

  name: 'App',

  data: function () {
    return {
    }
  },

  components: {
    WrongNetworkVue
  },

  computed: {
    address() {
      return this.$store.state.wallet.address;
    },
    network() {
      return this.$store.state.wallet.network;
    },
    isCorrectNetwork() {
      return this.$store.state.wallet.network == 5;
    }
  },

  mounted: async function () {
    const store = this.$store;
    if (!(await this.$ethers.getProvider().send("eth_requestAccounts",[]))) {
      this.$store.dispatch('wallet/connect');
    } else {
      store.dispatch('wallet/change', [await this.$ethers.getAddress()]);
      store.dispatch('wallet/changeNetwork', [(await this.$ethers.getNetwork()).chainId]);
    }
    window.ethereum.on('networkChanged', function (a) {
      store.dispatch('wallet/changeNetwork', a);
    });
    window.ethereum.on('accountsChanged', async function (a) {
      store.dispatch('wallet/change', a);
    });
  },

  methods: {
    connect: async function () {
      this.$store.dispatch('wallet/connect');
    }
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
  margin-top: 10px;
  background-color: #ebebeb;
}

header,
menu,
section {
  text-align: left;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  z-index: 100;
  position: relative;
}

header a {
  color: #00baf7;
  text-decoration: none;
  padding: 3px;
}

menu,
section {
  z-index: 80;
  border-radius: 0;
  position: relative;
}

section {
  z-index: 60;
  border-radius: 0 0 5px 5px;
  background-color: #2c3e50;
}

menuitem {
  padding: 5px;
  border-right: 1px dashed #00baf7;
  display: inline-block;
}

menuitem:last-child {
  border: 0;
}

menuitem a {
  color: #00baf7;
  text-decoration: none;
  padding: 3px;
}

menuitem a:hover {
  background-color: #00baf7;
  color: white;
}

.left {
  float: left;
}

.right {
  float: right;
}

.clear {
  clear: both;
}
</style>

<template>
    <div class="list">
      <UserVue v-for="i in users" :key="i.id" :user="i"></UserVue>
    </div>
  </template>
  
  <script>
  import { ethers } from 'ethers';
  import UserVue from './../components/User.vue';
  
  const getItems = async (self) => {
    const response = await fetch("https://api.thegraph.com/subgraphs/name/hotspurhn/mixort",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify({ "query": "{\n  users(first: 100) {\n    id\ntokens{id}  }\n}\n", "variables": null })
      });
  
    const data = (await response.json()).data.users.filter(x=>x.tokens.length > 0);
    self.users.push(...data.map(x => {
      return {
        count: x.tokens.length,
        id: x.id
      }
    }));
  }
  
  export default {
    name: 'OwnersComponent',
    components: {
        UserVue
    },
    data() {
      return {
        items: [],
        images: [],
        users: [],
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
  
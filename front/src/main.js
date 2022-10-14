import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ListVue from './views/List.vue'
import OwnersVue from './views/Owners.vue'
import OwnerVue from './views/Owner.vue'
import DetailsVue from './views/Details.vue'
import store from './store'
import { ethers } from 'ethers';
import marketplaceabi from './assets/marketplaceabi.json';
import erc721abi from './assets/erc721abi.json';
import erc20abi from './assets/erc20abi.json';

const routes = [
    { path: '/', component: ListVue, name: 'root' },
    { path: '/list', component: ListVue, name: 'list' },
    { path: '/owners', component: OwnersVue, name: 'owners' },
    { path: '/owner/:id', component: OwnerVue, name: 'owner' },
    { path: '/token/:id', component: DetailsVue, name: 'details' },
];
const router = createRouter({
    history: createWebHistory(),
    mode: 'hash',
    routes
});

const app = createApp(App);

app.use(store);
app.use(router);

const getProvider = () => new ethers.providers.Web3Provider(window.ethereum, "any");
const getSigner = () => getProvider().getSigner();
const getAddress = async () => await getSigner().getAddress();
const getNetwork = async () => await getProvider().getNetwork();
const getChainId = async () => (await getProvider().getNetwork()).chainId;
const getCurrentBlock = async () => (await getProvider().getBlockNumber());

app.config.globalProperties.$ethers = {
    ethers,
    getProvider,
    getAddress,
    getSigner,
    getChainId,
    getNetwork,
    getCurrentBlock
};

app.config.globalProperties.shortAddress = (address) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 3, address.length)}`;
};

app.config.globalProperties.$contracts = {
    address: {
        erc20: '0x4662B5C8009aed1446aa9fCa7DF4309102823D9E',
        erc721: '0xa5e69E1b04155108240bfa385d030c8D26191115',
        marketplace: '0x6C72FCE596aBab5db84470048Dc64d269787879C'
    },
    contracts: {
        erc20: async () => new ethers.Contract(app.config.globalProperties.$contracts.address.erc20, erc20abi, await getSigner()),
        erc721: async () => new ethers.Contract(app.config.globalProperties.$contracts.address.erc721, erc721abi, await getSigner()),
        marketplace: async () => new ethers.Contract(app.config.globalProperties.$contracts.address.marketplace, marketplaceabi, await getSigner()),
    }
};

app.mount('#app');
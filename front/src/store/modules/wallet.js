
//import { ethers } from 'ethers';
const state = () => ({
    address: '',
    network: null
})

// getters
const getters = {
    /*signer: async function ({ state }) {
        if (state && state.provider){
            return await state.provider.getSigner();
        }
        return null;
    }*/
}

// actions
const actions = {

    change({ commit }, address) {
        let a = '';
        if (address && address.length) {
            a = address[0];
        }
        commit('setAddress', a);
    },

    changeNetwork({ commit }, network) {
        commit('setNetwork', network);
    },

    connect: async function () {
        try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (ex) {
            console.log(ex);
        }
    }

}

// mutations
const mutations = {

    setAddress(state, address) {
        state.address = address;
    },
    setNetwork(state, network) {
        state.network = network;
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
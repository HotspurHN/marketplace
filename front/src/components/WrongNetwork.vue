<template>
    <div class="item-wrapper">
        Wrong network selected {{network}}. <a href="#" @click="changeNetwork">Change network</a>. 
    </div>
</template>

<script>

export default {
    name: 'WrongNetworkComponent',
    props: {
        network: Number
    },
    methods: {
        changeNetwork(){
            window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{
                    chainId: this.$ethers.ethers.utils.hexValue("0x05")
                }]
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

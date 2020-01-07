<template>
<main class="ma-2">
    <v-layout class="asset_panel">
        <v-card class="ma-1" v-for="asset in assets" :key="asset.asset">
            <v-card-text class="pa-2">
                {{asset.asset}}
            </v-card-text>
            <v-card-text class="pa-2">
                {{asset.free | fix}}
            </v-card-text>
        </v-card>
    </v-layout>
    <v-layout mt-3 class="btn_panel">
        <v-btn outlined width="80px" @click="buy" color="green" class="ma-1">Buy</v-btn>
        <v-btn outlined width="80px" @click="sell" color="red" class="ma-1">Sell</v-btn>

    </v-layout>
</main>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            assets: []
        }
    },
    filters: {
        fix: function(value) {
            return parseFloat(value).toFixed(3)
        }
    },
    methods: {
        buy() {
            this.$socket.client.emit('buy');
        },
        sell(val) {
            this.$socket.client.emit('sell');
            console.log(val)
        }
    },
    mounted() {
        this.$socket.client.emit('getAssets');
        // setInterval(() => {
        //     this.$store.commit('increment')
        //     console.log(this.$store.state.count)
        // }, 1000);

    },
    computed: mapState([
        'count'
    ]),
    sockets: {
        getAssets(val) {
            this.assets = val;
        },
        buy(val) {
            this.$socket.client.emit('getAssets');
            console.log(val)
        },
        sell(val) {
           this.$socket.client.emit('getAssets');
            console.log(val)
        }
    },

}
</script>

<style lang="less" scoped>
.asset_panel {
    padding: 2px;
    height: 84px;
    background-color: rgb(49, 49, 49);
}

.btn_panel {
    padding: 2px;
    background-color: rgb(49, 49, 49);
}
</style>>


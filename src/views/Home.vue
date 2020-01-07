<template>
<v-container fluid class="py-0">
    <v-layout wrap row>
        <v-flex xs12 md9 lg10>
            <div class="top-section">
                <GraphOG></GraphOG>
            </div>
        </v-flex>
        <v-flex xs6 md3 lg2>
            <div class="top-section "><Panel></Panel></div>
        </v-flex>
        <!-- <v-flex xs6 md12>
            <div class="top-section  bottom-section ">Controls</div>
        </v-flex> -->
    </v-layout>

</v-container>
</template>

<script>
import HelloWorld from "../components/HelloWorld";
import Graph from '../components/Graph';
import GraphOG from '../components/GraphOG';
import Panel from "../components/Panel";

export default {
    components: {
        HelloWorld,
        Graph,
        GraphOG,
        Panel
    },
    sockets: {
      connect() {
      // Fired when the socket connects.
      console.log("yo")
    },
		
    },
    mounted(){
      	//this.$socket.client.emit('getKlines', "home");
    }
};
</script>

<style lang="less" scoped>
.top-section {
    height: 100%;
}

@media only screen and (min-width: 960px) {
    .bottom-section {
        height: calc(30vh - 64px);
    }
}
</style>

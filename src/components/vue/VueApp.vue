<template>
<main>
    <div v-if="dataReady" class="container">
     <NebBar :qStruc="qStruc" /> 
     <NebTable :qStruc="qStruc" /> 
    </div>
</main>
</template>

<script>
  
  import {
    qlikConnect,
    chart,
    getAppFields,
    getMasterItems,
  } from "../function/qlik";

    import NebBar from "./NebBar.vue";
    import NebTable from "./NebTable.vue";

    export default {
    name: "VueApp",
    components: {
        NebBar,
        NebTable
    },
    props: [],
    data: function() {
        return {
            qStruc : {
                app: "",
                nebbie: "",
                allFields: "",
                masterMeasures: "",
            },
            dataReady: false
        }
    },
    async mounted() {
        let app = await qlikConnect();
        console.log(this.qStruc.app)
        let [nebbie, allFields, masterMeasures] = await Promise.all([
        chart(app),
        getAppFields(app),
        getMasterItems(app),
        ]);

        this.qStruc.app = app;
        this.qStruc.nebbie = nebbie;
        this.qStruc.allFields = allFields;
        this.qStruc.masterMeasures = masterMeasures;
        this.dataReady = true;
    }
    };
</script>


<style scoped>


  .container {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
</style>
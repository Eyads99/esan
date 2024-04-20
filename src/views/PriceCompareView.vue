<template>
    <SideDrawer/>
    <v-combobox
      clearable
      label="Combobox"
      :items = "['ABUK', 'ORAS', 'EFIC', 'ADIB', 'COMI', 'MFPC']"
      v-model = "assetsNames"
      multiple
    ></v-combobox>
    <PriceHistoryChart :assetsNames="assetsNames" title="title"/>
  </template>
  
  <script> 
  import SideDrawer from "/src/components/SideDrawer.vue";
  import PriceHistoryChart from "/src/components/PriceHistoryChart.vue"
  export default {
    name: "PriceCompare",
    components: {
      SideDrawer,
      PriceHistoryChart
    },
    data() {
      return {
        assetsNames: ["ORAS","ABUK"]
      }

    }
  }
  </script>
<template>
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

  import PriceHistoryChart from "/src/components/PriceHistoryChart.vue"
  export default {
    name: "PriceCompare",
    components: {
      
      PriceHistoryChart
    },
    data() {
      return {
        assetsNames: ["ORAS","ABUK"]
      }

    }
  }
  </script>
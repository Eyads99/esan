<template>
    <v-combobox
      clearable
      label="Combobox"
      :items = "[
        'ABUK',
        'ADIB',
        'ALCN',
        'AMOC',
        'BTFH',
        'COMI',
        'EAST',
        'EFID',
        'HRHO',
        'EFIH',
        'EKHO',
        'EKHOA',
        'SWDY',
        'ESRS',
        'FWRY',
        'GBCO',
        'HELI',
        'JUFO',
        'MASR',
        'MFPC',
        'ORAS',
        'ORHD',
        'ORWE',
        'PHDC',
        'CCAP',
        'SKPC',
        'TMGH',
        'ETEL',
        'SUGR',
        'PHAR',
        'ISPH',
      ]"
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
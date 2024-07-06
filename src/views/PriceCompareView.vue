<template>
  <head>
    <meta name="AssetCompare" content="asset compare" />
  </head>
  <v-col cols="12"  md="11" justify="center">
    <v-combobox
      clearable
      :label="$t('stocks')"
      :items = EGXTickerList
      v-model = "assetsNames"
      multiple
      max = 3
    ></v-combobox>
    
    <v-row dense>
    <v-col cols="12" md="6">
<!--     <div class="d-flex justify-center">
    <v-date-input
       v-model="dateRange"
      label="Select range"
      max-width="7500"
      multiple="range"
      min="1998-01-01 00:00:00.000">
    </v-date-input>
  </div> -->
      <v-date-input
        :label="$t('startingDate')"
        prepend-icon=""
        prepend-inner-icon="$calendar"
        variant="solo"
        min="1998-01-01 00:00:00.000"
        v-model="startDate">
      </v-date-input>

    </v-col>

    <v-col cols="12" md="6">
      <v-date-input
        :label="$t('endingDate')"
        prepend-icon=""
        variant="solo"
        v-model="endDate">
      </v-date-input>

    </v-col>
  </v-row>

    <v-checkbox label="Normalize" value=true v-model=normalize></v-checkbox>
    <PriceHistoryChart :assetsNames="assetsNames" :normalize=normalize :startDateObj="startDate" :endDateObj="endDate" :dateRange="dateRange" title="title" />
    <!-- <v-range-slider v-model="dateRange"
        strict> </v-range-slider> -->
  </v-col>
  </template>
  
  <script> 
  import { VDateInput } from 'vuetify/labs/VDateInput'
  import PriceHistoryChart from "/src/components/PriceHistoryChart.vue"
  
  export default {
    name: "PriceCompare",
    components: {
      PriceHistoryChart,
      VDateInput,
    },
    data() {
      return {
        assetsNames: ['ORAS','ABUK','AZ-SAVE'],
        normalize: false,
        startDate: new Date('2020-01-01'),
        endDate: new Date(),//today
        dateRange: [new Date('2020-01-01'), new Date()],
        EGX30TickerList: [
        "ABUK",
        "ADIB",
        "ALCN",
        "AMOC",
        "BTFH",
        "COMI",
        "EAST",
        "EFID",
        "HRHO",
        "EFIH",
        "EKHO",
        "EKHOA",
        "SWDY",
        "ESRS",
        "FWRY",
        "GBCO",
        "HELI",
        "JUFO",
        "MASR",
        "MFPC",
        "ORAS",
        "ORHD",
        "ORWE",
        "PHDC",
        "CCAP",
        "SKPC",
        "TMGH",
        "ETEL",
        "SUGR",
        "PHAR",
        "ISPH",
      ],
      EGX70TickerList: [
        "ACAP",
        "ACGC",
        "ADPC",
        "AFDI",
        "AIH",
        "AMER",
        "ARAB",
        "ASPI",
        "ATLC",
        "ATQA",
        "BINV",
        "CERA",
        "CICH",
        "CIEB",
        "CIRA",
        "CLHO",
        "COPR",
        "COSG",
        "DAPH",
        "DSCW",
        "ECAP",
        "EFIC",
        "EGAL",
        "EGAS",
        "EGCH",
        "EGTS",
        "EHDR",
        "ELKA",
        "ELSH",
        "EMFD",
        "ENGC",
        "ETRS",
        "EXPA",
        "GDWA",
        "GGCC",
        "HDBK",
        "IDRE",
        "IFAP",
        "ISMA",
        "ISMQ",
        "KABO",
        "KRDI",
        "KZPC",
        "MCQE",
        "MCRO",
        "MENA",
        "MEPA",
        "MICH",
        "MOIL",
        "MPRC",
        "MTIE",
        "NCCW",
        "OCDI",
        "ODIN",
        "OIH",
        "OLFI",
        "POUL",
        "PRCL",
        "PRDC",
        "PRMH",
        "QNBA",
        "RACC",
        "RAYA",
        "RMDA",
        "SAUD",
        "TALM",
        "TAQA",
        "UEGC",
        "UNIT",
        "ZMID",
      ],
      EGXTickerList:["AALR","ABUK","ACAMD","ACAP","ACGC","ACRO","ADCI","ADIB","ADPC","ADRI","AFDI","AFMC","AIFI","AIH","AJWA","ALCN",
      "ALUM","AMER","AMES","AMIA","AMOC","AMPI","ANFI","APSW","ARAB","ARCC","AREH","ARPI","ARVA","ASCM","ASPI","ATLC","ATQA","AXPH",
      "BIDI","BIGP","BINV","BIOC","BTFH","CAED","CANA","CCAP","CCRS","CEFM","CERA","CFGH","CICH","CIEB","CIRA","CLHO","CNFN","COMI",
      "COPR","COSG","CPCI","CSAG","CTSB","DAPH","DEIN","DGTZ","DOMT","DSCW","DTPP","EALR","EASB","EAST","EBSC","ECAP","EDBM","EDFM",
      "EEII","EFIC","EFID","EFIH","EGAL","EGAS","EGBE","EGCH","EGREF","EGSA","EGTS","EHDR","EIUD","EKHO","EKHOA","ELEC","ELKA","ELNA",
      "ELSH","ELWA","EMFD","ENGC","EOSB","EPCO","EPPK","ESRS","ETEL","ETRS","EXPA","FAIT","FAITA","FERC","FIRE","FNAR","FTNS","FWRY",
      "GBCO","GDWA","GGCC","GIHD","GMCI","GOCO","GRCA","GSSC","GTWL","HDBK","HELI","HRHO","IBCT","ICFC","ICID","ICLE","ICMI","IDHC",
      "IDRE","IEEC","IFAP","INEG","INFI","IRON","ISMA","ISMQ","ISPH","JUFO","KABO","KRDI","KWIN","KZPC","LCSW","LUTS","MAAL","MASR",
      "MBSC","MCQE","MCRO","MENA","MEPA","MFPC","MFSC","MHOT","MICH","MILS","MIPH","MISR","MKIT","MMAT","MOED","MOIL","MOIN","MOSC",
      "MPCI","MPCO","MPRC","MTIE","NAHO","NCCW","NDRL","NEDA","NHPS","NINH","NIPH","OBRI","OCDI","OCPH","ODIN","OFH","OIH","OLFI",
      "ORAS","ORHD","ORWE","PHAR","PHDC","PHTV","POUL","PRCL","PRDC","PRMH","QNBE","RACC","RAKT","RAYA","REAC","RKAZ","RMDA","ROTO","RREI",
      "RTVC","RUBX","SAIB","SAUD","SCEM","SCFM","SCTS","SDTI","SEIG","SIPC","SKPC","SMFR","SNFC","SPIN","SPMD","SUGR","SVCE","SWDY","TALM",
      "TANM","TAQA","TMGH","TRTO","UASG","UEFM","UEGC","UNIP","UNIT","UPMS","UTOP","VERT","WCDF","WKOL","ZEOT","ZMID",
      "EGX30","EGX70","EGX100","EGX30Cap","TAMAYOUZ", "AZ-GOLD","AZ-HALAN","AZ-MENTH", "AZ-OP","AZ-SAVE", "AZ-VALU","AZ-Maashy","AZ-Nasr", 
      "CI30", "B Secure","Mid-market EGGOLD", "Misr Takaful Fund"],
      EGXStockNames: []
    }
        


    },
  }
  </script>
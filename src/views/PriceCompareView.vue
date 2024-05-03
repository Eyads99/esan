<template>
  <v-col cols="12"  md="11" justify="center">
    <v-combobox
      clearable
      label="Stocks"
      :items = EGXTickerList
      v-model = "assetsNames"
      multiple
      max = 3
    ></v-combobox>
    
    <v-row dense>
    <v-col cols="12" md="6">
    <div class="d-flex justify-center">
    <v-date-input
       v-model="dateRange"
      label="Select range"
      max-width="7500"
      multiple="range"
      min="1998-01-01 00:00:00.000"
      >
    </v-date-input>
  </div>
      <v-date-input
        label="Starting date"
        prepend-icon=""
        prepend-inner-icon="$calendar"
        variant="solo"
        min="1998-01-01 00:00:00.000"
        v-model="startDate">
      </v-date-input>

    </v-col>

    <v-col cols="12" md="6">
      <v-date-input
        label="Ending date"
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
        startDate: new Date('2018-01-01'),
        endDate: new Date(),//today
        dateRange: [new Date('2018-01-01'), new Date()],
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
      EGXTickerList:["ACAP","AALR","ADIB","ABUK","ACRO","AJWA","SAUD","ECAP","FNAR","KRDI","AMPI","EOSB","ALCN","AFMC",
      "AMES","AMOC","ANFI","AXPH","RREI","AMER","APPC","ALUM","ACAMD","ACGC","ADPC","ADRI","ARAB","AMIA","ADCI","APSW","ARVA",
      "AIH","ARCC","DOMT","ARPI","ASCM","ASPI","ATLC","AIFI","AVGG","BINV","BTFH","BIGP","CAED","CIRA","CILB","KWIN","COSG",
      "POUL","CSAG","CASH","PRCL","CERA","CICH","CTSB","CLHO","COMI","CNFN","COPR","CIEB","DAPH","DCRC","DEIN","DTPP","SUGR",
      "DSCW","DGTZ","EFIH","EASB","EDFM","EAST","EXPA","EDBM","EFID","HRHO","EGAL","EPCO","MFSC","EGAS","EKHOA","EITP","EFIC",
      "EGBE","IRON","EKHO","MPRC","AREH","EGSA","TORA","EGTS","ETRS","EHDR","PHAR","EIUD","AFDI","EPPK","EEII","EALR","BIDI",
      "IRAX","ELKA","ELNA","KABO","OBRI","UEGC","SWDY","ELSH","SPHT","ELWA","ELEC","EMFD","ZEOT","ESRS","FAITA","FAIT","FWRY",
      "FIRE","FTNS","GDWA","GBCO","RAKT","GSSC","GIHD","GGCC","BIOC","GTHE","GMCI","GOCO","GTWL","GRCA","CCRS","HCFI","HDBK",
      "ISPH","ICFC","ICMI","IEEC","ENGC","IFAP","ICID","IDHC","INEG","IBCT","ICLE","ISMQ","IDRE","INFI","ISMA","JUFO","KZPC",
      "CPCI","EGCH","LCSW","LUTS","MCRO","MASR","MPCO","MOIL","MMAT","MAAL","MBEN","MEPA","MPCI","MENA","CEFM","WCDF","MIPH",
      "MBSC","MCQE","MICH","HELI","MFPC","MHOT","MKIT","ATQA","MOSC","MTIE","MOIN","NAHO","NCCW","NBKE","NDRL","NHPS","NCGC",
      "NIPH","MILS","NEDA","NINH","OLFI","OCPH","ODIN","ORAS","OFH","ORHD","OIH","ORWE","EBSC","PHDC","PRDC","PRMH","PHTV",
      "CCAP","QNBA","RACC","RAYA","REAC","RKAZ","ROTO","RTVC","RUBX","SCFM","SIPC","SMFR","SEIG","SNFC","SDTI","SKPC","SCEM",
      "OCDI","SNFI","SVCE","SPMD","SPIN","SCTS","CANA","TMGH","TALM","TANM","TAQA","ETEL","RMDA","MOED","TRTO","UPMS","UASG",
      "UNIT","UNIP","UEFM","UTOP","VERT","WKOL","ZMID","EGX30"]
      }

    },
  }
  </script>
<template>
  <head>
    <meta name="AssetCompare" content="asset compare" />
  </head>
  <v-col cols="12" md="12" justify="center">
    <v-combobox
      clearable
      :label="$t('stocks')"
      :items = EGXStocksList
      :return-object="false"
      v-model = "assetsNames"
      :item-text = "title"
      :item-value="value"
      multiple
      max = 3      
    >
  </v-combobox>
    
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

  <v-row dense>
  <v-col 
    cols="12" 
    md="2" 
    class="pa-0"
  >
    <v-checkbox label="Normalize" value=true v-model=normalize></v-checkbox>
  </v-col>
  <v-col 
    cols="12" 
    md="6" 
    class="pa-0"
  >
    <v-checkbox label="My Portfolio" value=true v-model=myPortfolio></v-checkbox>
  </v-col>
</v-row>
    <div style="height: 95vh">
      <PriceHistoryChart :assetsNames="assetsNames" :portfolio="myPortfolio" :normalize=normalize :startDateObj="startDate" 
          :endDateObj="endDate" :dateRange="dateRange" title="title" />
    </div>
    <!-- <v-range-slider v-model="dateRange"
        strict> </v-range-slider> -->
  </v-col>
  </template>
  
  <script> 
/*   import { db } from "/src/firebase/init";
  import { getAuth } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore"; */
  import { VDateInput } from 'vuetify/labs/VDateInput'
  import PriceHistoryChart from "/src/components/PriceHistoryChart.vue"
  
  export default {
    name: "PriceCompare",
    components: {
      PriceHistoryChart,
      VDateInput,
    },
    created() {
  // Convert dictionary to array
      this.EGXStocksList = Object.entries(this.stockTickersDict).map(([value, title]) => ({ title: `${title} (${value})`, value }));
      /* this.EGXStocksList.push({ title: 'My Portfolio', value: 'PORTFOLIO' }); */
    },
    data() {
      return {
        assetsNames: ['ORAS','COMI','Misr Takaful Fund'],
        normalize: false,
        myPortfolio: false,
        startDate: new Date('2022-01-01'),
        endDate: new Date(),//today
        dateRange: [new Date('2022-01-01'), new Date()],
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
      "ORAS","ORHD","ORWE","PHAR","PHDC","PHTV","POUL","PRCL","PRDC","PRMH","QNBE","RACC","RAKT","RAYA","REAC","RKAZ","RMDA","ROTO",
      "RREI","RTVC","RUBX","SAIB","SAUD","SCEM","SCFM","SCTS","SDTI","SEIG","SIPC","SKPC","SMFR","SNFC","SPIN","SPMD","SUGR","SVCE",
      "SWDY","TALM","TANM","TAQA","TMGH","TRTO","UASG","UEFM","UEGC","UNIP","UNIT","UPMS","UTOP","VERT","WCDF","WKOL","ZEOT","ZMID",
      "EGX30","EGX70","EGX100","EGX30Cap","TAMAYOUZ", "AZ-GOLD","AZ-HALAN","AZ-MENTH", "AZ-OP","AZ-SAVE", "AZ-VALU","AZ-Maashy","AZ-Nasr", 
      "CI30", "B Secure","Mid-market EGGOLD", "Misr Takaful Fund"],
      stockTickersDict: {
        ADIB: "Abu Dhabi Islamic Bank",
        ABUK: "Abu Qir Fertilizers and Chemicals",
        ACRO: "Acrow Misr",
        AJWA: "AJWA Food Industries",
        SAUD: "Al Baraka Bank",
        ECAP: "Al Ezz",
        KRDI: "Al Khair River for Development Agricultural Invest",
        ALCN: "Alexandria Containers & goods",
        AFMC: "Alexandria Flour Mills",
        AMES: "Alexandria Medical Center",
        AMOC: "Alexandria Mineral Oils",
        AMER: "Amer Group Holding",
        ACAMD: "Arab Co Asset Management",
        ACGC: "Arab Cotton Ginning",
        ADPC: "ARAB DAIRY",
        ARAB: "Arab Developers Holding",
        AMIA: "Arab Moltaka Invest",
        AIH: "Arabia Invest",
        ARCC: "Arabian Cement Co SAE",
        ARPI: "Arabian Rocks Plastic",
        ASCM: "ASEC Co for Mining",
        ATLC: "AT Lease",
        AIFI: "Atlas Land Reclamation",
        AVGG: "Average",
        BINV: "B Investments",
        BTFH: "Beltone Financial Hld",
        CAED: "Cairo Educational Svcs",
        CIRA: "Cairo Invest RE",
        COSG: "Cairo Oils & Soap",
        POUL: "Cairo Poultry",
        CSAG: "Canal Shipping Agencies",
        CASH: "Cash",
        PRCL: "Ceramic & Porcelain",
        CERA: "Ceramica Remas",
        CICH: "CI Capital",
        CLHO: "Cleopatra Hospital",
        COMI: "Commercial Int Bank",
        CIEB: "Credit Agricole Egypt",
        DAPH: "DAPH",
        DTPP: "Delta Printing & Packaging",
        SUGR: "Delta Sugar",
        DSCW: "Dice Sport & Casual Wear",
        EASB: "EASB",
        EAST: "Eastern Tobacco",
        EXPA: "EDBE",
        EDBM: "EDBM",
        EFID: "Edita Food",
        HRHO: "EFG Hermes Holdings",
        EFIH: "E-finance",        
        EGAL: "Egypt Aluminum",
        MFSC: "Egypt Free Shops",
        EGAS: "Egypt Gas",
        EKHOA: "Egypt Kuwait Holding",
        EFIC: "Egyptian Financial &Industrial",
        EGBE: "Egyptian Gulf Bank",
        IRON: "Egyptian Iron & Steel",
        EKHO: "Egyptian Kuwaiti Hld",
        MPRC: "Egyptian Media Production City",
        EGTS: "Egyptian Tourism Resorts",
        ETRS: "Egyptian Transport & Commercial Services",
        EHDR: "Egyptians Housing Develop",
        PHAR: "EIPICO",
        AFDI: "El Ahli Inv&Develop",
        ELKA: "El Kahera Housing",
        KABO: "El Nasr Clothing & Textiles",
        SWDY: "El Sewedy Electric",
        ELSH: "El Shams",
        EMFD: "Emaar Misr for Development SAE",
        EMRI: "Emerald for Real Estate Investments",
        ESRS: "Ezz Steel",
        FAITA: "Faisal Islamic Bank - USD",
        FAIT: "Faisal Islamic Bank of Egypt",
        FWRY: "Fawry Banking and Payment",
        GDWA: "Gadwa for Industrial Development",
        GBCO: "GB AUTO",
        RAKT: "General",
        GIHD: "GIHD",
        GGCC: "Giza General Contracting",
        BIOC: "Glaxo Smith Kline",
        GTWL: "Golden Textiles",
        CCRS: "Gulf Canadian RE Inv Co",
        HELI: "Misr El Gadida for Housing Dev",
        HDBK: "Housing & Develop Bank",
        ISPH: "Ibnsina Pharma",
        ENGC: "Industrial Engineering",
        IDHC: "Integrated Diagnostics Holding Co",
        IBCT: "International Business",
        ISMQ: "Iron Steel for Mines Quarries",
        ICLE: "IncoLEASE",
        IDRE: "Ismailia Develop & RE",
        ISMA: "Ismailia Misr Poultry",
        JUFO: "Juhayna Food",
        KZPC: "Kafr El Zayat Pesticides",
        EGCH: "Kima",
        LCSW: "Lecico Egypt",
        MCRO: "Macro Pharmaceutical",
        MASR: "Madinet Nasr for Housing and Development",
        MOIL: "Maridive & oil Svcs",
        MAAL: "Marseilia Egyptian Gulf Real Estate",
        MBEN: "MB Engineering",
        MEPA: "Medical Packaging",
        MENA: "Mena Touristic & RE",
        MIPH: "Minapharm Pharma",
        MBSC: "Misr Beni Suef Cement",
        MCQE: "Misr Cement",
        MICH: "Misr Chemical Industries",
        MFPC: "Misr Fertilizers",
        MHOT: "Misr Hotels",
        ATQA: "Misr National Steel",
        MTIE: "MM Group",
        MOIN: "Mohandes Insurance",
        NAHO: "Naeem Holding",
        NCCW: "Nasr Co. for Civil Works",
        NEDA: "Northern Upper Egypt Develop",
        NINH: "Nozha Int Hospital",
        OLFI: "Obour Land",
        ODIN: "ODIN Investments SAE",
        ORAS: "Orascom Construction Ltd",
        OFH: "Orascom Financial Holding",
        ORHD: "Orascom Hotels",
        OIH: "Orascom Invest",
        ORWE: "Oriental Weavers",
        EBSC: "Osool ESB Securities Broker",
        PACH: "Pachin",
        PHDC: "Palm Hills Develop",
        PRDC: "Pioneer Properties for Urban Development",
        PRMH: "Prime Holding",
        CCAP: "Qalaa Holdings",
        QNBA: "Qatar Natl Bank",
        RACC: "Raya Contact Center",
        RAYA: "Raya Holding",
        REAC: "Reacap Financial Invest",
        ROTO: "Rowad Tourism",
        SCFM: "South Cairo & Giza Mills",
        SEIG: "Saudi Egyptian Inv & Fin",
        SDTI: "Sharm Dreams Co.",
        SKPC: "Sidi Kerir",
        SCEM: "Sinai Cement",
        OCDI: "SODIC",
        SPMD: "Speed Medical",
        SPIN: "SPINALEX",
        TMGH: "TMG Holding",
        TALM: "Taaleem Management Services",
        ETEL: "Telecom Egypt",
        RMDA: "Tenth of Ramadan",
        MOED: "The Egyptian Modern Education",
        UASG: "United Arab Shipping",
        UNIT: "United Housing",
        UNIP: "Universal Co Packaging",
        ZMID: "Zahraa Maadi",
        BIGP: "BIG",
        ICID: "Int Co Invest & Development",
        SIPC: "Sabaa Intl Pharma and Chemical Industries",
        MMAT: "Marsa Marsa Alam Tourism",
        ICFC: "ICFC",
        SMFR: "Samad Misr-EGYFERT",
        INEG: "Integrated Engineering",
        AXPH: "Alexandria Pharma",
        FNAR: "Al Fanar Contracting",
        COPR: "Copper for Commercial Investment RE Dev",
        AMPI: "Al Moasher Programming",
        BIDI: "El Bader Plastic Co",
        GRCA: "Grand Invest Capital",
        TAQA: "TAQA Arabia",
        ALUM: "Arab Aluminum",
        DGTZ: "DIGITIZE for Investment",
        EIUD: "EIUD",
        ADRI: "Arab Develop",
        ARVA: "Arab Valves Co",
        MOSC: "Misr Oils & Soap",
        NHPS: "NHPS",
        CFGH: "Concrete Fashion Group",
        ACAP: "A Capital Holding",
        EEII: "El Arabia Engineering",
        ASPI: "Aspire Capital Holding for Financial Investments",
        FTNS: "Fitness Prime",
        AALR: "AALR",
        CEFM: "Middle Egypt Flour Mills",
        CANA: "Suez Canal Bank",
        SNFC: "Sharkia National Food",
        ZEOT: "Extracted Oils",
        EGSA: "Egyptian Satellite",
        CPCI: "Kahira Pharmaceuticals and Chemical Industries",
        ADCI: "Arab Pharma",
        OBRI: "El Obour RE Inv",
        DOMT: "Arabian Food Industries Co",
        RTVC: "RTVC",
        AREH: "Egyptian RE Group",
        DCRC: "Delta Construction & Rebuilding",
        RUBX: "Rubex Plastics",
        MILS: "North Cairo Mills",
        UPMS: "Union Pharmacist Company for Medical Services and",
        NIPH: "Nile Pharma",
        EALR: "El Arabia Land Reclamation",
        CNFN: "Contact Financial Holding",
        FIRE: "First Investment and Real Estate Development",
        SCTS: "Suez Canal",
        HCFI: "Holding Company for Fin Investments",
        SNFI: "Souhag National Food Industries",
        RKAZ: "REKAZ Financial Holding",
        PTCC: "Pharaoh tech",
        MKIT: "Misr Kuwait",
        VERT: "Vertika",
        CTSB: "City Trade Securities and Brokerage",
        FERC: "Ferchem Egypt Fertilizers and Chemicals",
        TANM: "Tanmiya for Real Estate Investment",
        EDFM: "East Delta Flour Mills",
        GSSC: "General Silos & Storage",
        SVCE: "South Valley Cement",
        MPCI: "Memphis Pharma",
        APSW: "Arab Polvara Spinning Weaving",
        WCDF: "Middle & West Delta Flour Mills",
        INFI: "Ismailia Food Industries",
        ELEC: "Electro Cable",
        UEFM: "Upper Egypt Flour Mills",
        UEGC: "El Saeed Contracting & RE Inv",
        IFAP: "Int Agricultural Products",
        WKOL: "Wadi Kom Ombo Land",
        ICMI: "ICMI",
        ELWA: "El Wadi Co.",
        MPCO: "Mansourah Poultry",
        ANFI: "Alexandria National Co",
        ALEX: "Alexandria Cement",
        EOSB: "Al Orouba Securities Brokerage",
        GPPL: "Golden Pyramids Plaza",
        SMPP: "Modern Shorouk",
        NBKE: "National Bank of Kuwait",
        LUTS: "Lotus for Agricultural Investments",
        GMCI: "GMC Group",
        TRTO: "TransOceans Tours",
        NCEM: "National Cement",
        DEIN: "Delta Insurance",
        TORA: "Egyptian Tourah Portland Cement",
        IRAX: "EL Ezz Aldekhela Steel",
        EGREF: "Egyptians Real Estate Fund",
        GETO: "Genial Tours",
        UNFO: "Univert Food",
        UTOP: "UTOPIA",
        TRST: "Thiqah for Business Administration Dev",
        DIFC: "International Dry Ice",
        IEEC: "Industrial Engineer Enterprises",
        VODE: "Vodafone Egypt Telecom",
        APPC: "APP",
        EITP: "Egyptian Co for International",
        EPPK: "El Ahram Co.",
        GOCO: "Golden Coast Co",
        KWIN: "Cairo National Co for Investment and Securities",
        MEGM: "Middle East Glass",
        NDRL: "National Drilling",
        NOAF: "North Africa Co. RE Inv",
        RREI: "ALICO",
        SPHT: "El Shams Pyramids",
        EPCO: "Egypt for Poultry",
        GTHE: "Global Telecom",
        ELNA: "El Nasr Agricultural Crops",
        PHTV: "Pyramisa Hotels",
        SAIB: "SAIB",
        AGIN: "Gulf Arab Investment",
        OCPH: "October Pharma",
        NCGC: "Nile Cotton Ginning",
        MISR: "Misr Intercontinental for Granite",
        CILB: "City Lab",
        EGX30:"EGX30",
        EGX70:"EGX70",
        EGX100:"EGX100",
        EGX30Cap:"EGX30Cap",
        TAMAYOUZ:"TAMAYOUZ",
        "Azimut GOLD": "AZ-GOLD",
        "Azimut HALAN":"AZ-HALAN",
        "Menthum":"AZ-MENTH",
        "Azimut Opportunity":"AZ-OP",
        "AZ SAVE":"AZ-SAVE",
        "AZ VALU":"AZ-VALU",
        "AZ Maashy":"AZ-Maashy",
        "AZ NASER":"AZ-Nasr", 
        "CI30":"CI30", 
        "B Secure":"B Secure",
        "Mid-market EGGOLD":"Mid-market EGGOLD", 
        "Misr Takaful Fund":"Misr Takaful Fund",
        "Beltone EGX100":"Beltone EGX100",
        "Beltone EGX33":"Beltone EGX33",
      },
      EGXStocksList: [],
    }

    },
    methods: {
      filterItems(item, searchTerm) {
      const search = searchTerm.toLowerCase();
      return item.value.toLowerCase().includes(search) || item.title.toLowerCase().includes(search);
    },

      decodePortfolio(encodedStr) {
        console.log("encodedStr: ", encodedStr)
        const entries = encodedStr.split(';').map(entry => entry.split(':'));
        const portfolio = {};
        for (const [stock, percentage] of entries) {
            portfolio[stock] = parseInt(percentage);
        }
        console.log("decoded portfolio: ", portfolio)
        return portfolio;
  },      
      },
    
  }
  </script>
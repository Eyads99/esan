<template>
  <v-container>
    <div class="font" style="width: 100%; height: 8%">
      {{ title }}
    </div>
    <div class="blank-space"></div>
    <th>{{ maxBarValue }}</th>

    <div :id="`bar-chart${title}`" style="width: 100%; min-height: 520px"></div>
  </v-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: ["labels", "values", "title", "dataZoom"],
  data() {
    return {
      chartId: 0, // Initialize a counter; unneeded
      stockTickersDict: {
        ADIB: "Abu Dhabi Islamic Bank",
        ABUK: "Abu Qir Fertilizers and Chemical Industries",
        ACRO: "Acrow Misr",
        AJWA: "AJWA Food Industries",
        SAUD: "Al Baraka Bank",
        ECAP: "Al Ezz",
        KRDI: "Al Khair River for Development Agricultural Invest",
        ALCN: "Alexandria Containers&goods",
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
        PRCL: "Ceramic&Porcelain",
        CERA: "Ceramica Remas",
        CICH: "CI Capital",
        CLHO: "Cleopatra Hospital",
        COMI: "Commercial Int Bank",
        CIEB: "Credit Agricole Egypt",
        DAPH: "DAPH",
        DTPP: "Delta Printing&Packaging",
        SUGR: "Delta Sugar",
        DSCW: "Dice Sport&Casual Wear",
        EASB: "EASB",
        EAST: "Eastern Tobacco",
        EXPA: "EDBE",
        EDBM: "EDBM",
        EFID: "Edita Food",
        HRHO: "EFG Hermes Holdings",
        EFIH: "E-finance",
        EGX30: "EGX30",
        EGAL: "Egypt Aluminum",
        MFSC: "Egypt Free Shops",
        EGAS: "Egypt Gas",
        EKHOA: "Egypt Kuwait Holding",
        EFIC: "Egyptian Financial&Industrial",
        EGBE: "Egyptian Gulf Bank",
        IRON: "Egyptian Iron&Steel",
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
        GTWL: "Golden Textiles&Clothes Wool",
        CCRS: "Gulf Canadian RE Inv Co",
        HELI: "Misr El Gadida for Housing Dev",
        HDBK: "Housing&Develop Bank",
        ISPH: "Ibnsina Pharma",
        ENGC: "Industrial Engineering",
        IDHC: "Integrated Diagnostics Holding Co",
        IBCT: "International Business",
        ISMQ: "Iron Steel for Mines Quarries",
        ICLE: "IncoLEASE",
        IDRE: "Ismailia Develop&RE",
        ISMA: "Ismailia Misr Poultry",
        JUFO: "Juhayna Food",
        KZPC: "Kafr El Zayat Pesticides",
        EGCH: "Kima",
        LCSW: "Lecico Egypt",
        MCRO: "Macro Pharmaceutical",
        MASR: "Madinet Nasr for Housing and Development",
        MOIL: "Maridive & oil Svcs",
        MAAL: "Marseilia Egyptian Gulf Real Estate Investment",
        MBEN: "MB Engineering",
        MEPA: "Medical Packaging",
        MENA: "Mena Touristic&RE",
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
        SCFM: "S.Cairo&Giza Mills&Bakeries",
        SEIG: "Saudi Egyptian Inv&Fin",
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
        UNIT: "United Housing&Develop",
        UNIP: "Universal Co Packaging",
        ZMID: "Zahraa Maadi",
        BIGP: "BIG",
        ICID: "Int Co Invest&Development",
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
        DCRC: "Delta Construction&Rebuilding",
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
        GSSC: "General Silos&Storage",
        SVCE: "South Valley Cement",
        MPCI: "Memphis Pharma",
        APSW: "Arab Polvara Spinning Weaving",
        WCDF: "Middle&West Delta Flour Mills",
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
      },
    };
  },

  watch: {
    values: {
      handler: function (newValues, oldValues) {
        if (newValues !== oldValues && oldValues) {
          //console.log("values changed")
          const options = {
            yAxis: {
              type: "category",
              data: this.labels,
              inverse: false,
              axisLabel: {
                show: true,
                interval: 0,
                rotate: 0,
                //padding: 10,
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: "Cascadia code",
                color: "#5a5f6e",
              },
            },
            series: [
              {
                data: this.values,
                type: "bar",
                barWidth: "50%",
                //fontWeight: "bold",

                itemStyle: {
                  //barBorderRadius: [5, 5, 5, 5],
                  borderRadius: 5,
                  /*normal: {
                    color: function (params) {
                      // Find the maximum value in the data array
                      let maxBarValue = Math.max(this.values);

                      // Set a different color for the top bar
                      if (params.value === maxBarValue) {
                        return "#ff0000";
                      } else {
                        return "#0f4294";
                      }
                    },
                  },
                */
                },
                label: {
                  show: true,
                  position: "right",
                  formatter: "{c}%",
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: "Cascadia code",
                  color: "#818691",
                },
                emphasis: {
                  itemStyle: {
                    barWidth: "6000%",
                  },
                },
              },
            ],
          };
          // set new options to the chart
          const chart = echarts.getInstanceByDom(
            document.getElementById(["bar-chart" + this.title])
          );

          if (chart) {
            chart.setOption(options);
            //chart.on("click", this.handleBarClick);
          }
        }
      },
      deep: true, // This ensures that changes within the array are detected
      immediate: true,
    },
  },

  mounted() {
    //window.addEventListener('resize', this.handleResize); //this is to handle zoom in/out from browser
    this.chartId++;
    const chartDom = document.getElementById(["bar-chart" + this.title]);
    const myChart = echarts.init(chartDom);
    // Sort the data array based on values in descending order
    //const sortedValues = this.values.slice().sort((a, b) => a - b); //data should be sorted in input
    //let maxBarValue = Math.max(this.values);

    let options = {
      grid: {
        left: "left",
        top: "top",
        responsive: true,
        right: "15%",
        bottom: "0%",
        containLabel: true,
      },

      tooltip: {
        show: true,
        formatter: (params) => {
          const barName = params.name;
          const value = params.value;
          const extraInfo = this.stockTickersDict[barName] || barName;
          return `<b>${extraInfo}</b><br/>` + `Value: ${value}<br/>`;
        },
      },

      barCategoryGap: "5000%", // Add this line to increase the gap between bars (doesn't work)
      // Other options for your chart
      visualMap: {
        show: false, //removes the postive negative legend
        type: "piecewise",
        dimension: 0,
        pieces: [
          { gt: 0, color: "#4e81cf" }, // Blue for positive values (> 0)
          { lte: 0, color: "#fc6075" }, // Red for negative values (<= 0)
          /*{
            min: maxBarValue ,
            max: maxBarValue ,
            color: "#A40500",
          },
          */
        ],
      }, // Update the labelStyle for xAxis and yAxis in the mounted function of BarChart.vue

      xAxis: {
        type: "value",
        show: false,
        axisLine: { show: true },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: this.labels,
        inverse: false,
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 0,
          //padding: 10,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Cascadia code",
          color: "#5a5f6e",
        },

        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          data: this.values,
          type: "bar",
          barWidth: "50%",
          fontWeight: "bold",
          fontFamily: "Cascadia Code",
          itemStyle: {
            //barBorderRadius: [5, 5, 5, 5],
            borderRadius: 5,
          },
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            fontSize: 15,
            //barPercentage: 0.6,
            barCategoryGap: "5000%",
          },
          emphasis: {
            itemStyle: {
              barWidth: "6000%",
            },
          },
        },
      ],
    };

    if (this.dataZoom) {
      options.dataZoom = {
        type: "slider",
        yAxisIndex: 0,
        zoomLock: false,
        width: 20,
        right: 5,
        minValueSpan: 3, //min # of bars to show
        maxValueSpan: 35,
        startValue: 0, //start and end represent the # bars of chart to show by default
        endValue: 15,
        handleSize: 20,
        showDetail: false,
      };
    }

    myChart.setOption(options);
    //myChart.on("hover", this.handleBarClick);
  },
  methods: {
    handleResize() {
      const chart = echarts.init(
        document.getElementById(`bar-chart${this.title}`)
      ); //this is to handle zoom in/out from browser
      chart.resize();
    },

    async getStockName(ticker) {
      if (!this.stockTickersDict) {
        // Fetch JSON data only once (efficiency)
        try {
          const response = await fetch("/src/data/company_data");
          if (!response.ok) {
            throw new Error("Failed to fetch extra info JSON");
          }
          const jsonData = await response.json();
          this.stockTickersDict = jsonData; // Store parsed JSON data
        } catch (error) {
          console.error("Error fetching extra info:", error);
          // Handle errors gracefully, e.g., return default info
          return "Error: Extra information unavailable";
        }
      }
      console.log(this.stockTickersDict[ticker], "ticker called");
      return this.stockTickersDict[ticker] || "No extra information available";
    },
  },
};
</script>

<style scoped>
.font {
  /*position: absolute;*/
  /*top: 0;*/
  color: white;
  /*margin-bottom: -50px; /*space between chart title and chart */
  font-weight: bold;
  height: 100px;
  width: 250px;
  font-size: 30px;
  font-family: Cascadia code;
  background-color: #a29cb8;
  border-radius: 10pc;
  /*text-align: right;*/
}
.blank-space {
  height: 20px; /* Adjust the height value to add blank space */
}
</style>

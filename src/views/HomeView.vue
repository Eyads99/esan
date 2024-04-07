<template>
<v-app style="background-color: #edeff4fe;">
  <sideDrawer/>
    <v-main >
      <h1>EGX Today</h1>
      <v-btn @click="changeValues">Top / Bottom 10</v-btn>
         --
      <v-btn-toggle
          v-model="indexSelection"
          background-color="primary"
          mandatory
          @click="indexChg"
        >
          <v-btn flat value="30">EGX30</v-btn>
          -
          <v-btn value="70">EGX70</v-btn>
          -
          <v-btn value="100">EGX100</v-btn>
          {{ indexSelection }}
        </v-btn-toggle>


      <v-container fluid >
        <v-row no-gutters>
          <v-col
           cols="12" md="6" justify="center">
           <v-card elevated class="card-margin">
            <BarChart style="height: 75vh"
              title="Average performance/sector"
              :labels = sectors
              :values= sectorChg
            />
          </v-card>          
          
          <div v-if="idxPointShow">
            <v-card elevated class="card-margin">
              <h3>EGX{{indexSelection}} Today</h3>
              <TodayBar :dailyChange="idxDailyChgShow" :currentPoints="idxPointShow" :YtDate="idxYtDate"/>
            </v-card>
            </div>
            <div v-else>  
              <v-card loading> 
              Loading Today's details
            </v-card>
            </div>
          </v-col>

          <v-col
          cols="12" md="6" justify="center">

         <div v-if="topstockChgs">
          <v-card elevated class="card-margin">
          <BarChart style="height: 75vh"
            :labels="topStockNames"
            :values="topstockChgs"
            title="Stock Market Today"
          />
        </v-card>
        </div>
        <div v-else>
          <v-card loading>
          Loading EGX stocks
          </v-card>
        </div>
        <div v-if="gainers">
          <v-card elevated class="card-margin">
            <h3>Gainers and losers</h3>
           <PieChart :gainers="gainers" :losers="losers" ID="GL" />
          </v-card>
          </div>
          <div v-else>
            <v-card loading>Loading Pie Chart</v-card></div>
          </v-col>
        </v-row>
      </v-container>
    </v-main> 
    
    </v-app>
</template>

<script>
import { getDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase/init";
import BarChart from "/src/components/BarChart.vue";
import PieChart from "/src/components/PieChart.vue";
import TodayBar from "/src/components/TodayBar.vue";
import SideDrawer from "/src/components/SideDrawer.vue";

export default {
  name: "App",
  data() {
    return {
      idxPointShow: null,//this data is to be shown to user
      idxYtDate: null, //this data is to be shown to user
      idxDailyChgShow: null, //this data is to be shown to user
      topstockChgs: null, //used as prop in charts has chaging data
      topStockNames: null, //used as prop in charts has chaging data
      topCount: 10, //get top x given value i.e 10 -> top ten; -5 -> bottom 5
      allStockNamesOrder: null,
      allChgValuesOrder: [],
      gainers: null,
      losers: null,
      sectors: [],
      sectorChg: [],
      allStocksChgToday : null, //dict in form {stockname: chg} has all stocks and their chg
      indexSelection: 30, // default set to EGX30
      indexChgs: {}, // gets % change for all indices
      indexPoints: {}, // gets points for all indices
      EGX30TickerList : ["ABUK","ADIB","ALCN","AMOC","BTFH","COMI","EAST","EFID","HRHO","EFIH","EKHO","EKHOA","SWDY","ESRS",
      "FWRY","GBCO","HELI","JUFO","MASR","MFPC","ORAS","ORHD","ORWE","PHDC","CCAP","SKPC","TMGH","ETEL","SUGR","PHAR","ISPH"],
      EGX70TickerList : ["ACAP","ACGC","ADPC","AFDI","AIH","AMER","ARAB","ASPI","ATLC","ATQA","BINV","CERA","CICH","CIEB","CIRA",
      "CLHO","COPR","COSG","DAPH","DSCW","ECAP","EFIC","EGAL","EGAS","EGCH","EGTS","EHDR","ELKA","ELSH","EMFD","ENGC","ETRS",
      "EXPA","GDWA","GGCC","HDBK","IDRE","IFAP","ISMA","ISMQ","KABO","KRDI","KZPC","MCQE","MCRO","MENA","MEPA","MICH","MOIL",
      "MPRC","MTIE","NCCW","OCDI","ODIN","OIH","OLFI","POUL","PRCL","PRDC","PRMH","QNBA","RACC","RAYA","RMDA","SAUD","TALM",
      "TAQA","UEGC","UNIT","ZMID"],
      idxBeginYTDValues : {"EGX30": 25501.94, "EGX70":5640.68,"EGX100":8111.12, "EGX30Cap":30887.48,"TAMAYOUZ":6531.4},
    };
  },
  methods: {
    changeValues() {
      this.topCount *= -1
      if (this.topCount > 0) {
        this.topStockNames = this.allStockNamesOrder.slice(0, this.topCount) // get first 10 elements
        this.topstockChgs = this.allChgValuesOrder.slice(0, this.topCount)
      } else {
        this.topStockNames = this.allStockNamesOrder.slice(this.topCount) // get last 10 elements
        this.topstockChgs = this.allChgValuesOrder.slice(this.topCount) 
      }
    },

    indexChg()
    {
      console.log(this.indexSelection)
      const idx = "EGX" + this.indexSelection
      this.idxDailyChgShow = ((this.indexChgs[idx])*100).toFixed(2);
      this.idxPointShow = this.indexPoints[idx];
      this.idxYtDate = ((this.idxPointShow - this.idxBeginYTDValues[idx]) / this.idxBeginYTDValues[idx]*100).toFixed(2)
      

      // deals with top stocks
      let stocksNeeded
      switch(idx) {
      case "EGX30":
        //set stocksNeeded to all stocks that are a value in the dict allStocksChgToday and are in the list EGX30TickerList
        //get all key value pairs where a key is in EGX30TickerList

        stocksNeeded = Object.fromEntries(Object.entries(this.allStocksChgToday).filter(([key]) => this.EGX30TickerList.includes(key)));


        //this.allStocksChgToday.filter(x => this.EGX30TickerList.includes(x))//error hear checking for enttries not keys
        break;
      case "EGX70":
        stocksNeeded = Object.fromEntries(Object.entries(this.allStocksChgToday).filter(([key]) => this.EGX70TickerList.includes(key)));
        break;
      default: //assumes other will allways be EGX100
        //set stocksNeeded to include both EGX30 or EGX70 
        stocksNeeded = Object.fromEntries(Object.entries(this.allStocksChgToday).filter(([key]) => this.EGX30TickerList.includes(key) || this.EGX70TickerList.includes(key) ));
      }

      const topstocks = Object
          .entries(stocksNeeded) // create Array of Arrays with [key, value]
          .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
          .slice(0,this.topCount) // return only the first 10 elements of the intermediate result
        //reverse order of top10
      topstocks.reverse()

      this.topStockNames = topstocks.map(([n])=> n) //extract names  
      this.topstockChgs = topstocks.map(([,n])=> (n*100).toFixed(2)) //extract values  
      
      this.gainers = Object.values(stocksNeeded).filter((x) => x > 0).length
      this.losers = Object.values(stocksNeeded).filter((x) => x < 0).length//stocksNeeded.length - this.gainers //0 is considered a loss

    },

    getAvgChg(stockNames, allChgs) {
      let sum = 0
      let count = 0
      for (let i = 0; i < stockNames.length; i++) 
        { 
          sum += allChgs[stockNames[i]]
          count +=1
        }
      return ((sum / count)*100).toFixed(2)
    }
  },

  components: {
    BarChart,
    PieChart,
    TodayBar,
    SideDrawer,
  },
    mounted(){

    //let docRef = doc(db, 'stocks', 'EGX30') unneeded after this.indexChg func
    let secdocRef = doc(db, "info", "industry")  

   /* getDoc(docRef).then(doc => { //gets todays trading data for stocks
      var today = new Date()
      var yesterday = new Date()

      if (new Date().getHours() < 15) // if before 3PM
        today.setDate(today.getDate() - 1)

      var dayOfWeek = today.getDay()
      if (dayOfWeek > 4)
        today.setDate(today.getDate() - (dayOfWeek-4))

      yesterday.setDate(today.getDate() - 1) 
      
      today = today.toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format
      yesterday = yesterday.toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format

      //var newYear = parseInt(today.slice(0,4)+'0102') // 1st jan is holiday
      today = parseInt(today)
      yesterday = parseInt(yesterday)


      /*this.idxPointShow = doc.data()[today]; //gets point for EGX30 today
      this.idxYtDate = (
        ((doc.data()[today] - doc.data()[newYear]) / doc.data()[newYear]) * 100).toFixed(2); // round to 3 dp
      this.idxDailyChgShow = (
        ((doc.data()[today] - doc.data()[yesterday]) / doc.data()[yesterday]) *100).toFixed(2); // unneeded to do this.indexChg func
    });*/

    let docRef = doc(db, "stocks", "changes") //get stock with last trading day's changes
    
    getDoc(docRef).then((doc) => {
      this.allStocksChgToday = doc.data()//gets dict with all stocks with last trading day's chgs

      this.allStockNamesOrder = Object.keys(doc.data()); //reorder obj to be in descending order
      this.allStockNamesOrder.sort((a, b) => doc.data()[a] - doc.data()[b]);

      for (let i = 0; i < this.allStockNamesOrder.length; i++) {
        // get all keys and values and push them into their arrays
        let key = this.allStockNamesOrder[i];
        this.allChgValuesOrder.push(((doc.data()[key])*100).toFixed(2))//makes array with all chgs in decreasing order  
    }   

        /*this.topStockNames = this.allStockNamesOrder.slice(0,10)// get last 30 elements
        this.topstockChgs = this.allChgValuesOrder.slice(0,10)// get last 30 elements

        this.gainers = this.allChgValuesOrder.filter((x) => x > 0).length //get the number of stocks that increased
        this.losers = this.allChgValuesOrder.length - this.gainers*/ //unneed after this.indexChg() func

        //below is for next doc for getting sectors and their component stocks
        return getDoc(secdocRef) 
      }).then((doc2) => { //get sector change
          
        const sectorsDoc = Object.keys(doc2.data())

        for (let i = 0; i < sectorsDoc.length; i++) {
          let currSector = sectorsDoc[i]
          this.sectorChg[currSector] = this.getAvgChg(doc2.data()[currSector], this.allStocksChgToday)
        }
        //make sectorChg in descending order by values
        this.sectorChg = Object.entries(this.sectorChg).sort((a, b) => a[1] - b[1]).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});


        this.sectors = Object.keys(this.sectorChg)
        this.sectorChg = Object.values(this.sectorChg)
        //make all sectors First letter capital
        this.sectors = this.sectors.map( x => {return x.charAt(0).toUpperCase() + x.slice(1)})

      });     
    
       //get index daily change data
    docRef = doc(db, "stocks", "idxChanges")
    getDoc(docRef).then(doc => {
      console.log(doc.data())// TODO see why this must be logged to work!!!
      this.indexChgs = doc.data()

      });
      
    docRef = doc(db, "stocks", "todayIndices")
    getDoc(docRef).then(doc => {
      //console.log(doc.data())// TODO see why this must be logged to work!!!
      this.indexPoints = doc.data()      
      this.indexSelection = 30
      this.indexChg()  
    });
      
      console.log("end of mount")
  }
}
</script>

<style>

.card-margin {
  margin: 10px;
}

.bar {
  width: 20px;
  margin-right: 5px;
}

#app {
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  /*margin-top: 60px;*/
  background-color: #edeff4fe;
}
</style>
<template>
    <v-app style="background-color: white">
        <v-main >
          <h1>EGX {{indexSelection }} Today </h1>          
          <v-btn-toggle
              v-model="indexSelection"
              background-color="primary"
              mandatory
              rounded="lg"
              border="md"
              divided
              color="success"
              @click="indexChg"
            >
              <v-btn value="30">EGX30</v-btn>          
              <v-btn value="70">EGX70</v-btn>                         
            </v-btn-toggle>
    
          <v-container fluid >
            <v-row no-gutters>
            <v-col cols="12" md="6" justify="center">
              <div v-if="idxPointShow">
                <v-card elevated class="card-margin">
                
                  <h3>EGX{{indexSelection}} Today</h3>                            
                  <div>                                 
                    <TodayBar                      
                      align="left"
                      justify="left"
                      :dailyChange="idxDailyChgShow" :currentPoints="idxPointShow" :YtDate="idxYtDate"
                    />
                  </div>
                </v-card>
                </div>
                <div v-else>  
                  <v-card loading> 
                  Loading Today's details
                </v-card>
                </div>
            
                    <div v-if="gainers">
                  <v-card style="height: 35vh" elevated class="card-margin">
                    <h3>{{ $t('marketMovement') }}</h3>
                  <PieChart style=" height: 95%" :gainers="gainers" :losers="losers" ID="GL" />
                  </v-card>
                  </div>
                  <div v-else>
                    <v-card loading>Loading Pie Chart</v-card>
                  </div>
                </v-col>        
            <v-col cols="12" md="12" justify="center">
    
             <div v-if="topstockChgs">
              <v-card elevated class="card-margin">
              <BarChart style="height: 66vh"
                :labels="topStockNames"
                :values="topstockChgs"
                dataZoom = True 
                :title="$t('movementToday')"/>
                </v-card>
                </div>
                <div v-else>
                  <v-card loading>
                  Loading EGX stocks
                  </v-card>
                </div>              
              </v-col>
            </v-row>
          </v-container>
        </v-main>         
    </v-app>
    </template>
    
    <script>
    import { getDoc, doc } from "firebase/firestore";
    import { db } from "/src/firebase/init";
    //import { toRaw } from 'vue';
    import BarChart from "/src/components/BarChart.vue";
    import PieChart from "/src/components/PieChart.vue";
    import TodayBar from "/src/components/TodayBar.vue";
    
    export default {
      name: "App",
      data() {
        return {
          idxPointShow: null,//this data is to be shown to user
          idxYtDate: null, //this data is to be shown to user
          idxDailyChgShow: null, //this data is to be shown to user
          topstockChgs: null, //used as prop in charts has changing data
          topStockNames: null, //used as prop in charts has changing data
          topCount: 70, //get top x given value i.e 10 -> top ten; -5 -> bottom 5
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
          sectorComponents: {}, // Key array pairs for sectors and component stocks
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
    
        indexChg()
        {
          //deals with todayBar data
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
            //this.allStocksChgToday.filter(x => this.EGX30TickerList.includes(x))//error here checking for entries not keys
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
              .sort(([, a],[, b]) => (this.topCount>0 ? b - a : a - b)) // sort by value, descending (b-a)
              .slice(0, Math.abs(this.topCount)) // return only the first topCount elements of the intermediate result
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
      },
      mounted(){
        getDoc(doc(db, "stocks", "idxChanges")).then(doc => {this.indexChgs = doc.data()}); // get changes in EGX indices 

        getDoc(doc(db, "stocks", "todayIndices")).then(doc => {    
        this.indexPoints = doc.data()      
        this.indexSelection = 30});

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

            //below is for next doc for getting sectors and their component stocks
            
        }).then(() => { //get sector change

            this.indexChg() 
        });     
  
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

    .today-bar {
      background-color: rgb(255, 255, 255);
      padding: 7px;
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
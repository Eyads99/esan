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
          
          <div v-if="idxPoints">
            <v-card elevated class="card-margin">
              <h3>EGX{{indexSelection}} Today</h3>
              <TodayBar :dailyChange="idxDailyChg" :currentPoints="idxPoints" :YtDate="idxYtDate"/>
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
           <PieChart :gainers=gainers :losers=losers />
          </v-card>
          </div>
          <div v-else><v-card loading>Loading Pie Chart</v-card></div>
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
      idxPoints: null,
      idxYtDate: null,
      idxDailyChg: null,
      topstockChgs: null,
      topStockNames: null,
      Switch: 10,
      allStockNamesOrder: null,
      allChgValuesOrder: [],
      gainers: null,
      losers: null,
      sectors: [],
      sectorChg: [],
      allStocksChgToday : null, //dict in form {stockname: chg}
      indexSelection: 30
    };
  },
  methods: {
    changeValues() {
      this.Switch *= -1
      if (this.Switch > 0) {
        this.topStockNames = this.allStockNamesOrder.slice(0, this.Switch) // get first 10 elements
        this.topstockChgs = this.allChgValuesOrder.slice(0, this.Switch)
      } else {
        this.topStockNames = this.allStockNamesOrder.slice(this.Switch) // get last 10 elements
        this.topstockChgs = this.allChgValuesOrder.slice(this.Switch) 
      }
    },

    indexChg()
    {
      console.log(this.indexSelection)
      this.idxDailyChg=10;
      this.idxPoints=10;
      this.idxYtDate=10;
      

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

    let docRef = doc(db, 'stocks', 'EGX30')
    let secdocRef = doc(db, "info", "industry")  

    getDoc(docRef).then(doc => {
      //var today = new Date().toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format      
      //if friday or saturday set today to previous thrusday
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

      var newYear = parseInt(today.slice(0,4)+'0102') // 1st jan is holiday
      today = parseInt(today)
      yesterday = parseInt(yesterday)


      this.idxPoints = doc.data()[today]; //gets point for EGX30 today
      this.idxYtDate = (
        ((doc.data()[today] - doc.data()[newYear]) / doc.data()[newYear]) * 100).toFixed(2); // round to 3 dp
      this.idxDailyChg = (
        ((doc.data()[today] - doc.data()[yesterday]) / doc.data()[yesterday]) *100).toFixed(2);
    });

    docRef = doc(db, "stocks", "changes") //get stock with last trading day's changes
    
    getDoc(docRef).then((doc) => {
      this.allStocksChgToday = doc.data()

      this.allStockNamesOrder = Object.keys(doc.data()); //reorder obj to be in descending order
      this.allStockNamesOrder.sort((a, b) => doc.data()[a] - doc.data()[b]);

      for (let i = 0; i < this.allStockNamesOrder.length; i++) {
        // get all keys and values and push them into their arrays
        let key = this.allStockNamesOrder[i];
        //keys.push(key)     
        this.allChgValuesOrder.push(((doc.data()[key])*100).toFixed(2))  
    }   

        this.topStockNames = this.allStockNamesOrder.slice(0,10)// get last 30 elements
        this.topstockChgs = this.allChgValuesOrder.slice(0,10)// get last 30 elements

        this.gainers = this.allChgValuesOrder.filter((x) => x > 0).length //get the number of stocks that increased
        this.losers = this.allChgValuesOrder.length - this.gainers

        //below is for next doc for getting sectors and their component stocks
        return getDoc(secdocRef) 
      }).then((doc2) => {
          
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
<template>
  <!-- Button to change the values -->
  <h1>EGX Today</h1>
  <button @click="changeValues">Top / Bottom 10</button>
  <div>
    <p>{{ Switch }}</p>
  </div>
  <div class="container">
    <div class="row d-flex">
      <div class="col-sm-5">
        <BarChart
          title="Average performance/sector"
          :labels = sectors
          :values= sectorChg
        />
        <h3>EGX30 Today</h3>
        <div v-if="EGXIndex">
            <TodayBar :dailyChange="EGXDaily" :currentPoints="EGXIndex" :YtDate="EGXYtDate"/>
          </div>
          <div v-else>Loading Today's details</div>
      </div>

      <div class="col-sm-6">
        <div v-if="topstockChgs">
          <BarChart
            :labels="topStockNames"
            :values="topstockChgs"
            title="Stock Market Today"
          />
        </div>
        <div v-else>Loading EGX stocks</div>
        <div v-if="gainers">
           <PieChart :gainers= gainers :losers=losers />
          </div>
          <div v-else>Loading Pie Chart</div>
      </div>

  </div>
</div>

</template>

<script>
import { getDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase/init";
import BarChart from "/src/components/BarChart.vue";
import PieChart from "/src/components/PieChart.vue";
import TodayBar from "/src/components/TodayBar.vue";

export default {
  name: "App",
  data() {
    return {
      EGXIndex: null,
      EGXYtDate: null,
      EGXDaily: null,
      topstockChgs: null,
      topStockNames: null,
      Switch: 10,
      allStockNamesOrder: null,
      allChgValues: [],
      gainers: null,
      losers: null,
      sectors: [],
      sectorChg: [],
      allStocksChgToday : null

    };
  },
  methods: {
    changeValues() {
      this.Switch *= -1
      if (this.Switch > 0) {
        this.topStockNames = this.allStockNamesOrder.slice(0, this.Switch) // get first 10 elements
        this.topstockChgs = this.allChgValues.slice(0, this.Switch)
      } else {
        this.topStockNames = this.allStockNamesOrder.slice(this.Switch) // get last 10 elements
        this.topstockChgs = this.allChgValues.slice(this.Switch) 
      }
    },

    getDayBefore(dateInt) //function takes int in date format YYYYMMDD and outputs in in same format of previous day
    {
      //convert int to date from format YYYYMMDD
      const date = new Date(dateInt.toString().slice(0, 4), dateInt.toString().slice(4, 6) - 1, dateInt.toString().slice(6)); // Adjust month for Date() constructor
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return parseInt(`${year}${month}${day}`);
    },

    getAvgChg(sectorName,stockNames, allChgs) {
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

    let docRef = doc(db, 'stocks', 'EGX30')
    let secdoc = doc(db, "info", "industry")  

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

      //var yesterday = this.getDayBefore(today); //this is incorrect given weekends      
      
      today = today.toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format
      yesterday = yesterday.toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format

      var newYear = parseInt(today.slice(0,4)+'0102') // 1st jan is holiday
      today = parseInt(today)
      yesterday = parseInt(yesterday)


      this.EGXIndex = doc.data()[today]; //gets point for EGX30 today
      this.EGXYtDate = (
        ((doc.data()[today] - doc.data()[newYear]) / doc.data()[newYear]) * 100).toFixed(2); // round to 3 dp
      this.EGXDaily = (
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
        this.allChgValues.push(((doc.data()[key])*100).toFixed(2))  
    }   

        this.topStockNames = this.allStockNamesOrder.slice(0,10)// get last 30 elements
        this.topstockChgs = this.allChgValues.slice(0,10)// get last 30 elements

        this.gainers = this.allChgValues.filter((x) => x > 0).length //get the number of stocks that increased
        this.losers = this.allChgValues.length - this.gainers

        //below is for next doc for getting sectors and their component stocks
        return getDoc(secdoc) 
      }).then((doc2) => {
          
        const sectorsDoc = Object.keys(doc2.data())

        for (let i = 0; i < sectorsDoc.length; i++) {
          let currSector = sectorsDoc[i]
          this.sectorChg[currSector] = this.getAvgChg(currSector,doc2.data()[currSector], this.allStocksChgToday)
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
.gap {
  height: -90px;
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
  margin-top: 60px;
}
</style>
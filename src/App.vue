<template>
  <div class="container">
    <div class="row d-flex">
      <div class="col-sm-6">
        <BarChart :values="[-1.31, -0.23, 1, 1.32, 1.38, 2.64, 3.77, 4.22, 4.93, 5.99, 6.02,6.6]" title="Average performance/sector" :labels="['Consumables','Banks','Healthcare','Real Estate','Textiles & Durables','Energy','Contracting','NBFS','Transportation','Basic Resources','Communucation','Industrials']" />
      </div>

      <div class="col-sm-6">
        <BarChart :labels="['Orascom Construction',
            'CIB',
            'Eastern',
            'Abu Qir',
            'Wadi Kom Ombo',]" :values="[11.9, 10.2, 2.6, 1.1, 0.1]" title="Top 5 gainers"/>
        <div class="chart-container2">
          <PieChart :gainers="25" :losers="20" />
        </div>
        <div class="chart-container1">
          <TodayBar dailyChange="-1.5" currentPoints="5674" YtDate="5.62" />
        </div>
    

    <div class="col-sm-12">
      <div v-if="stockChgs">
        <BarChart :labels=stockNames :values=stockChgs title="Stock Market Today"/>
      </div>
      <div v-else>
           Loading EGX stocks
      </div>

      <div v-if="EGXIndex">
        <TodayBar :dailyChange =EGXDaily :currentPoints =EGXIndex  :YtDate = EGXYtDate />
      </div>
      <div v-else>
        Loading Todays details
      </div>
      <PieChart :gainers =5 :losers=20 />
    </div>
</div>
</div>
</div>
</template>

<script>
import { getDoc,doc } from 'firebase/firestore';
import { db } from './firebase/init'
import BarChart from "./components/BarChart.vue";
import PieChart from "./components/PieChart.vue";
import TodayBar from "./components/TodayBar.vue";

export default {
  name: 'App',
  data(){
      return {
        EGXIndex : null,
        EGXYtDate : null,
        EGXDaily : null,
        stockChgs : null,
        stockNames : null
      }
  },
  components: {
    BarChart,
    PieChart,
    TodayBar,
  },
    mounted(){

    let docRef = doc(db, 'stocks', 'EGX30')
      
    getDoc(docRef).then(doc => {
      var today = new Date().toISOString().slice(0, 10).replace(/-/g, '')//gets today date in YYYYMMDD format      
      var newYear = parseInt(today.slice(0,4)+'0102') // 1st jan is holiday
      today = parseInt(today)      

      if (new Date().getHours() < 15) // if before 3PM
        today -=1

      var yesterday = today-1 //this is incorrect given weekends      
      

      this.EGXIndex = (doc.data()[today]) //gets point for EGX30 today
      this.EGXYtDate = ((doc.data()[today] - doc.data()[newYear])/doc.data()[newYear] * 100).toFixed(3) // round to 3 dp
      this.EGXDaily = ((doc.data()[today] - doc.data()[yesterday])/doc.data()[yesterday] * 100).toFixed(3)    
      })
    
    docRef = doc(db, 'stocks', 'changes') //get stock with last trading day's changes
    getDoc(docRef).then(doc => {
      //const keys = []
      const values = []
      
      let keysOrder = Object.keys(doc.data())//reorder obj to be in descending order
      keysOrder.sort((a, b) => doc.data()[a] - doc.data()[b])

      for (let i = 0; i < keysOrder.length; i++) {// get all keys and values and push them into their arrays
        //console.log(keysOrder)
        let key = keysOrder[i]
        //console.log(key)
        //keys.push(key)     
        values.push(((doc.data()[key])*100).toFixed(2))  
    }   

        this.stockNames = keysOrder.slice(0,5)// get last 30 elements
        this.stockChgs = values.slice(0,5)// get last 30 elements
        console.log(this.stockNames)
        console.log(this.stockChgs)
      })


  }
}
</script>

<style>
.gap {
  height: -90px;
}

.chart-container1 {
  position: absolute;
  top: 550px;
  left: 115px;
  width: 40%;
  height: 10%;
}

.chart-container2 {
  position: absolute;
  top: 410px;
  left: 800px;
  width: 40%;
  height: 10%;
}
.bar {
  width: 20px;
  margin-right: 5px;
}
#app {
  font-size: large;
  font-family: Avenir, cursive, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top: 60px;
}
</style>

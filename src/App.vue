<template>
  <div class="container">
    <div class="row d-flex">
      <div class="col-sm-6">
        <BarChart
          :labels="['Consumables','Banks','Healthcare','Real Estate','Textiles & Durables','Energy','Contracting',
            'NBFS','Transportation','Basic Resources','Communucation','Industrials']"
          :values="[-1.31, -0.23, 1, 1.32, 1.38, 2.64, 3.77, 4.22, 4.93, 5.99, 6.02,6.6,]"
          title="Average Performance/Sector"
        />
      </div>
    

    <div class="col-sm-12">
    <BarChart :labels=stockNames :values=stockChgs title="Stock Market Today"/>

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

      this.EGXIndex = (doc.data()[today])
      this.EGXYtDate = ((doc.data()[today] - doc.data()[newYear])/doc.data()[newYear] * 100).toFixed(3) // round to 3 dp
      this.EGXDaily = ((doc.data()[today] - doc.data()[yesterday])/doc.data()[yesterday] * 100).toFixed(3)    
      })
    
    docRef = doc(db, 'stocks', 'changes')
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
        values.push((doc.data()[key]).toFixed(2))  
    }   

        this.stockNames = keysOrder.slice(-30)// get last 30 elements
        this.stockChgs = values.slice(-30)// get last 30 elements
        console.log(this.stockNames)
        console.log(this.stockChgs)
      })


  }
}
</script>

<style>
#app {
  font-size: large;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

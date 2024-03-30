<template>
  <!-- Button to change the values -->
  <button @click="changeValues">Top / Bottom 10</button>
  <div>
    <!-- Lines 137 and 138 with the values to be changed -->
    <p>{{ Switch }}</p>
  </div>
  <div class="logo-container top-left">
    <img src="./assets/Logo2.jpeg" alt="Logo" id="logo" />
  </div>
  <div class="logo-container top-right">
    <img src="./assets/Logo2.jpeg" alt="Logo" id="logo" />
  </div>
  <div class="logo-container bottom-left">
    <img src="./assets/Logo2.jpeg" alt="Logo" id="logo" />
  </div>
  <div class="logo-container bottom-right">
    <img src="./assets/Logo2.jpeg" alt="Logo" id="logo" />
  </div>
  <div class="container">
    <div class="row d-flex">
      <div class="col-sm-5">
        <BarChart
          title="Average performance/sector"
          :labels="[
            'Consumables',
            'Banks',
            'Healthcare',
            'Real Estate',
            'Textiles & Durables',
            'Energy',
            'Contracting',
            'NBFS',
            'Transportation',
            'Basic Resources',
            'Communucation',
            'Industrials',
          ]"
          :values="[
            -1.31, -0.23, 1, 1.32, 1.38, 2.64, 3.77, 4.22, 4.93, 5.99, 6.02,
            6.6,
          ]"
        />
      </div>

      <div class="col-sm-6">
        <div v-if="stockChgs">
          <BarChart
            :labels="stockNames"
            :values="stockChgs"
            title="Stock Market Today"
          />
        </div>
        <div v-else>Loading EGX stocks</div>

        <div class="chart-container2">
          <PieChart :gainers="25" :losers="20" />
        </div>
        <div class="chart-container1">
          <div v-if="EGXIndex">
            <TodayBar
              :dailyChange="EGXDaily"
              :currentPoints="EGXIndex"
              :YtDate="EGXYtDate"
            />
          </div>
          <div v-else>Loading Today's details</div>
        </div>

        <div class="col-sm-12">
          <PieChart :gainers="5" :losers="20" />
        </div>
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

</template>

<script>
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase/init";
import BarChart from "./components/BarChart.vue";
import PieChart from "./components/PieChart.vue";
import TodayBar from "./components/TodayBar.vue";

export default {
  name: "App",
  data() {
    return {
      EGXIndex: null,
      EGXYtDate: null,
      EGXDaily: null,
      stockChgs: null,
      stockNames: null,
      Switch: 10,
      keysOrder: null,
      values: [],
    };
  },
  methods: {
    changeValues() {
      this.Switch *= -1;
      if (this.Switch > 0) {
        this.stockNames = this.keysOrder.slice(0, this.Switch); // get last 30 elements
        this.stockChgs = this.values.slice(0, this.Switch);
      } else {
        this.stockNames = this.keysOrder.slice(this.Switch); // get last 30 elements
        this.stockChgs = this.values.slice(this.Switch); // get last 30 elements
      }
      console.log(this.stockNames);
      console.log(this.stockChgs);
    },
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

      var yesterday = today - 1; //this is incorrect given weekends      

      this.EGXIndex = doc.data()[today]; //gets point for EGX30 today
      this.EGXYtDate = (
        ((doc.data()[today] - doc.data()[newYear]) / doc.data()[newYear]) *
        100
      ).toFixed(3); // round to 3 dp
      this.EGXDaily = (
        ((doc.data()[today] - doc.data()[yesterday]) / doc.data()[yesterday]) *
        100
      ).toFixed(3);
    });

    docRef = doc(db, "stocks", "changes"); //get stock with last trading day's changes
    getDoc(docRef).then((doc) => {
      //const keys = []
      //let values = [];

      this.keysOrder = Object.keys(doc.data()); //reorder obj to be in descending order
      this.keysOrder.sort((a, b) => doc.data()[a] - doc.data()[b]);

      for (let i = 0; i < this.keysOrder.length; i++) {
        // get all keys and values and push them into their arrays
        //console.log(keysOrder)
        let key = this.keysOrder[i];
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
  top: 600px;
  left: 115px;
  width: 40%;
  height: 10%;
}

.chart-container2 {
  position: absolute;
  top: 500px;
  left: 750px;
  width: 40%;
  height: 10%;
}
.bar {
  width: 20px;
  margin-right: 5px;
}
.logo-container {
  width: 100px; /* Set the width and height of the container to create a square */
  height: 100px;
  border-radius: 100%;
  overflow: hidden;
  position: fixed;
}
.logo-container img {
  width: 100%; /* Make the image fill the container width */
  height: 100%;
  object-fit: cover; /* Maintain the aspect ratio of the image */
}
.top-left {
  top: 10px;
  left: 10px;
}

.top-right {
  top: 10px;
  right: 10px;
}

.bottom-left {
  bottom: 10px;
  left: 10px;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
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

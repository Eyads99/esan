<template>
  <img alt="Vue logo" src="./assets/logo.png">

  <div class="container">  <div class="row d-flex">
    <div class="col-sm-6"> 
    <BarChart :labels="['Consumables','Banks', 'Healthcare', 'Real Estate', 'Textiles & Durables', 'Energy', 'Contracting','NBFS', 'Transportation', 'Basic Resources', 'Communucation','Industrials']"
    :values="[-1.31,-0.23,1,1.32,1.38,2.64,3.77,4.22,4.93,5.99,6.02,6.6]" title="Average Performance/Sector"/>
    </div>
    
    <div class="col-sm-6">
    <BarChart :labels="['Orascom', 'CIB', 'Eastern','Abu Qir', 'Wadi Kom Ombo']" :values="[11.9, 10.2, 2.6, 1.1,0.1]" title="Top 5 gainers"/>
    <TodayBar dailyChange ='-1.5' currentPoints='5674' YtDate='5.62'/>
    <PieChart :gainers='25' :losers='20'/>
    </div>
  </div></div>

</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

import BarChart from './components/BarChart.vue'
import PieChart from './components/PieChart.vue'
import TodayBar from './components/TodayBar.vue'


export default {
  name: 'App',
  components: {
    BarChart,
    PieChart,
    TodayBar
  },

  created() {
    // Initialize Firebase
    const firebaseConfig = {
      
    };
    firebase.initializeApp(firebaseConfig);
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
    <v-container fluid fill-height style="height: 95vh;" >
       <div :id="`price-history-chart${title}`" style=" height: 100%"></div>
     </v-container>
</template>


<script>
import * as echarts from "echarts";
import { toRaw } from 'vue';
import { getDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase/init";

export default {
  name: "PriceHistoryChart",
  props: ["assetsNames", "title", "normalize"],
  data() {
    return {
      assets : {},
      dates : new Set(),
      prices : [],
    };
  },
  
    mounted() {
    //window.addEventListener('resize', this.handleResize); //this is to handle zoom in/out from browser
    this.chartId++;
    const chartDom = document.getElementById(["price-history-chart" + this.title]); 

    this.fetchData().then(() => 
    {
      let dims = Array.from(this.dates) // turn the dates set into a list 
      //dims.unshift('stock');
      console.log("dims", dims)

      let data = []

      for (const asset of this.assetsNames) {
        data.push(
          {
            name: asset,
            dates: Object.keys(toRaw(this.assets)[asset]),
            prices: Object.values(toRaw(this.assets)[asset])
        })
      }

      const options = {
      legend: {},
      tooltip: {
          trigger: 'axis'
        },
      dataZoom: {
              type: "slider",
              //xAxisIndex: 0,
              zoomLock: false,
              width: 1200,
              right: 120,
              minValueSpan: 4, //min # of bars to show
              maxValueSpan: 2500, 
              startValue: 0, //start and end represent the # points of chart to show by default
              endValue: 3000,
              handleSize: 20,
              //showDataShadow: false, //removes outline of graph in zoombar
            },

      // Declare an x-axis (category axis).
      // The category map the first column in the dataset by default.
      xAxis: { type: 'category',
              data: dims,
              axisLabel: {formatter: function (value) {return echarts.time.format('yyyy-MM-dd', value);}}
            },
      // Declare a y-axis (value axis).
      yAxis: { type: 'value', name:"Price"},
      
      series: data.map(lineData => ({
        type: 'line',
        connectNulls: true,
        showSymbol: false, //removes dots on the chart
        data: lineData.prices, // Reference the y-axis values for each line TODO fix date issue
        name: lineData.name, // Optional: Name for the line in legend
      }))

  };                 
    const myChart = echarts.init(chartDom);
    myChart.setOption(options);
  });
}, 


methods:{
async fetchData() {
  this.assets = {}
  for (const asset of this.assetsNames) {
    let docRef = doc(db, "stocks", asset);
    const stockDoc = await getDoc(docRef);
    let data = stockDoc.data();
    
    this.assets[asset] = data;

    // add dates to the dates set
    let keys = Object.keys(data);
    this.dates = new Set()
    for (let i = 0; i < keys.length; i++) {
      if (keys[i][0] == '2' || keys[i][0] == '1') //excludes non date data
        { //transform key date in for YYYYMMDD to YYYY-MM-DD
            this.dates.add(keys[i].slice(0, 4) + '-' + keys[i].slice(4, 6) + '-' + keys[i].slice(6, 8)/*+"T20:00:00Z"*/);        
        }
    }
    
    this.prices.push(Object.values(data));
  }
    },

    updateAssets()
  { 
    this.fetchData().then(() => 
{   console.log("this.dates", this.dates)
  
    let dims = Array.from(this.dates) // turn the dates set into a list 
    let data = []
    

    for (const asset of this.assetsNames) {
      let prices = Object.values(toRaw(this.assets)[asset])
      if (this.normalize !=false) //find first non NaN value and divide every number by it
      {
        //find first non NaN value 
        let basePrice = -1
        for (let i = 0; i < prices.length; i++) 
        {
          if (!isNaN(toRaw(prices[i]))) 
          {
            basePrice = toRaw(prices[i])
            break;
          }
        }        
        prices = toRaw(prices).map(x => (x/basePrice).toFixed(3)) //divide values in prices by basePrice by map & round to 3 dp
      }
      data.push(
        {
          name: asset,
          dates: Object.keys(toRaw(this.assets)[asset]),
          prices: prices
        })
      
    }
    
    const options = {
              // Declare an x-axis (category axis).
              // The category map the first column in the dataset by default.
              xAxis: {type: 'category',
                      data: dims,
                      axisLabel: {formatter: function (value) {return echarts.time.format('yyyy-MM-dd', value);}}
                    },
              // Declare a y-axis (value axis).
              yAxis: { type: 'value', name:"Price"},
              
              series: data.map(lineData => ({
                type: 'line',
                showSymbol: false, //removes dots on the chart
                connectNulls: true,
                data: lineData.prices, // Reference the y-axis values for each line
                name: lineData.name, // Name for the line in legend
              })),
        }
        const chart = echarts.getInstanceByDom(document.getElementById(["price-history-chart" + this.title]))
        chart.setOption(options, {
    replaceMerge: ['xAxis', 'yAxis', 'series'] // this ensures proper updating of the graph elements
});
           
  })
  }
},

watch: {
  assetsNames(newValues, oldValues) {        
        if ((newValues !== oldValues) && oldValues)
        {
          this.updateAssets()
        }        
      },

  normalize(newValues, oldValues){
    if ((newValues !== oldValues) && oldValues !=null )
    {
          this.updateAssets()
    }    
  },
  
  }
};
</script> 

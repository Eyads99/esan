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
      startDate : null,
      endDate: null,
    };
  },
  
    mounted() {
    //window.addEventListener('resize', this.handleResize); //this is to handle zoom in/out from browser
    this.chartId++;
    const chartDom = document.getElementById(["price-history-chart" + this.title]); 

    this.fetchData().then(() => 
    {
      let dims = Array.from(this.dates) // turn the dates set into a list 
      //turn every string in dims into a date obj 
      //dims = dims.map(x => new Date(x))


      //dims.unshift('stock');
      console.log("dims", dims)

      let data = []

      for (const asset of this.assetsNames) {
        
        let temp = []
        let datesList = this.makeDateList(Object.keys(toRaw(this.assets)[asset])) 
        for (let i = 0; i < datesList.length; i++) {      
          let value = Object.values(toRaw(this.assets)[asset])[i]==="NaN" ? Number.NaN : Object.values(toRaw(this.assets)[asset])[i]
          temp.push([datesList[i], value])             
        }
        
        data.push(
          {
            name: asset,
            dates: Object.keys(toRaw(this.assets)[asset]),
            prices: Object.values(toRaw(this.assets)[asset]),
            data: temp,
        })
      }      
      const options = {
      legend: {        
      },
      tooltip: {
          trigger: 'axis',
          //formatter: '{c0}: {a0}' TODO fix formatter see https://echarts.apache.org/en/option.html#tooltip.formatter
        },
      dataZoom: {
              type: "slider",
              //xAxisIndex: 0,
              zoomLock: false,
              width: 1200, // width of the zoom bar on user screen
              right: 120, // how much it is shifted right on user screen
              minValueSpan: 979999999, //min # of dates to show
              //maxValueSpan: 2500, 
              //startValue: 0, //start and end represent the # points of chart to show by default
              start:0,
              end:100,
              endValue: 30000,
              handleSize: 25,
              //showDataShadow: false, //removes outline of graph in zoombar
            },

      xAxis: { type: 'time',
              //data: dims,
              //min: 'dataMin',
              axisLabel: {formatter: '{yyyy}-{MM}-{dd}'}
            },
      // Declare a y-axis (value axis).
      yAxis: { type: 'value', name:"Price"},
      
      series: data.map(lineData => ({
        type: 'line',
        connectNulls: true,
        showSymbol: false, //removes dots on the chart
        data: lineData.data, // Reference the y-axis values for each line TODO fix date issue
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
        { 
          //check date value is not null
          //if ( data[keys[i]] != "NaN")
          //transform key date in for YYYYMMDD to YYYY-MM-DD
            this.dates.add(keys[i].slice(0, 4) + '-' + keys[i].slice(4, 6) + '-' + keys[i].slice(6, 8));        
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
    //dims = dims.map(x => new Date(x))
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
                      min: 'dataMin',
                      //axisLabel: {formatter: function (value) {return echarts.time.format('yyyy-MM-dd', value);}}
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
  },

  makeDateList(dates){
      let dateList = new Set()

      for (let i = 0; i < dates.length; i++) {
        if (dates[i][0] == '2' || dates[i][0] == '1') //excludes non date data
        { 
          //check date value is not null
          //if ( data[keys[i]] != "NaN")
          //transform key date in for YYYYMMDD to YYYY-MM-DD
          dateList.add(dates[i].slice(0, 4) + '-' + dates[i].slice(4, 6) + '-' + dates[i].slice(6, 8));        
        }
    }
    
    return Array.from(dateList)
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

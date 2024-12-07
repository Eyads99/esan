<template>
  <head>
    <meta name="PriceHistory" content="Asset Compare" />
  </head>
    <v-container fluid fill-height style="height: 95%;padding: 0;" >
       <div :id="`price-history-chart${title}`" style=" height: 95%"></div>
     </v-container>
</template>


<script>
import * as echarts from "echarts";
import { toRaw } from 'vue';
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase/init";

export default {
  name: "PriceHistoryChart",
  props: ["assetsNames", "title","portfolio", "normalize","startDateObj","endDateObj","dateRange"],
  data() {
    return {
      assets : {},
      startDate : null,
      endDate : null,
      portfolioList: [],
      assetNamesWithPortfolio: [],
      portfolioCache: false
    };
  },
  
    async mounted() {
      
      this.startDate = this.startDateObj.toISOString().split('T')[0]; //convert from Date 
      this.endDate = this.endDateObj.toISOString().split('T')[0];
      
      const chartDom = document.getElementById(["price-history-chart" + this.title]); 
      const myChart = echarts.init(chartDom);
        window.addEventListener('resize', () => {
          myChart.resize();
        }); //this is to handle zoom in/out from browser

    this.fetchData().then(() => 
    {

      let data = []      
      for (const asset of this.assetsNames) {
        
        let stockData = []
        let datesList = this.makeDateList(Object.keys(toRaw(this.assets)[asset])) 
        let startdateObj  = new Date(this.startDate)
        let endDateObj = new Date(this.endDate)

        for (let i = 0; i < datesList.length; i++) {
          //let datei = datesList[i] redundant
          let dateiObj = new Date(datesList[i])
          
          
          if ( dateiObj < startdateObj) continue; //don't add this date if before starting date
          if ( dateiObj > endDateObj) break; //don't add this date if after ending date
          
          let value = Object.values(toRaw(this.assets)[asset])[i]==="NaN" ? Number.NaN : Object.values(toRaw(this.assets)[asset])[i]
          stockData.push([datesList[i], value])             
        }
        
        data.push(
          {
            name: asset,
            data: stockData,
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
              //width: 1200, // width of the zoom bar on user screen
              //right: 120, // how much it is shifted right on user screen
              minValueSpan: 979999999, //min # of dates to show should equal about a week
              //maxValueSpan: 2500, 
              //startValue: 0, //start and end represent the # points of chart to show by default
              start:0, //show from the beginning to end; 0-100%
              end:100,              
              handleSize: 25,
              //showDataShadow: false, //removes outline of graph in zoombar
              show: window.innerWidth > 400,  // Only show zoom on larger screens
            },

      xAxis: { type: 'time',
              //min: 'dataMin',
              axisLabel: {formatter: '{yyyy}-{MM}-{dd}', hideOverlap: true,  padding: [0, 10, 0, 10], margin:10, fontSize: 11, },
              axisTick: { 
                alignWithLabel: true,  // Align ticks with labels
              },
            },
      // Declare a y-axis (value axis).
      yAxis: { type: 'value', name:"Price"},
      
      series: data.map(lineData => ({
        type: 'line',
        connectNulls: true,
        showSymbol: false, //removes dots on the chart
        data: lineData.data, // Reference the y-axis values for each line TODO fix date issue
        name: lineData.name, // Name for the line in tooltip
      }))

  };                 
    const myChart = echarts.init(chartDom);
    myChart.setOption(options);
  });
}, 


methods:{
async fetchData() {
  
  if (this.portfolio && this.portfolioCache===false) //if portfolio selected
      {        
        this.portfolioCache = true
        let portfolioResponse = await this.getPortfolioDoc()
        let portfolio = this.decodePortfolio(portfolioResponse.portfolio)


        for (let asset of Object.keys(portfolio)) {// get assets in portfolio

            let chached = false
            let keys = Object.keys(this.assets)

              for (let i=0; i < keys.length; i++) //dont retrieve stocks that already exist 
                { 
                  if (asset==keys[i])
                  {
                  chached = true
                  break
                  }
                }

              if (chached) // keep previous data as is 
                continue 

              let docRef = doc(db, "stocks", asset);
              const stockDoc = await getDoc(docRef);
              let data = stockDoc.data();
              this.assets[asset] = data;
        }

        let firstKey = Object.keys(portfolio)[0]
        let weightedPortfolioValue = this.assets[firstKey]        
        //rename first key in weightedPortfolioValue to prevent issue between portfolio and first stock
        weightedPortfolioValue = { ...weightedPortfolioValue, [`${firstKey}_value`]: weightedPortfolioValue.value }
        delete weightedPortfolioValue.value

        for (const ticker of Object.keys(portfolio))
        {
          
          let stockData = this.assets[ticker]

        Object.keys(this.assets[ticker]).forEach(key => {
          let numberOfStocks = portfolio[ticker]
          if (ticker == firstKey) // to compansate for the first stock already exisiting 
             numberOfStocks -= 1

          if (!weightedPortfolioValue[key]) {
                weightedPortfolioValue[key] = 0;
            }

          if (stockData[key] === undefined || stockData[key] === null || stockData[key] === "NaN" )   
            weightedPortfolioValue[key] = 0; 
            
          else if (!isNaN(stockData[key]))
              {                              
                 weightedPortfolioValue[key] = weightedPortfolioValue[key] + (stockData[key] * numberOfStocks);
              }
        });

        }
        
        this.assets['Portfolio'] = weightedPortfolioValue;
        //remove duplicates from adding portfolio here

        console.log("weightedPortfolioValue", weightedPortfolioValue)
        console.log("portfolio keys", Object.keys(portfolio))
        console.log("portfolio vals", Object.values(portfolio))
        this.portfolioList = portfolio
      }

  
 this.assetNamesWithPortfolio = this.assetsNames.concat(Object.keys(this.portfolioList)) //add portfolio to asset list
 this.assetNamesWithPortfolio = this.assetsNames.concat("Portfolio")
 //this.assetNamesWithPortfolio = [...new Set(this.assetNamesWithPortfolio)] //remove duplicate entries
  
  for (let asset of this.assetNamesWithPortfolio) {

    let chached = false
    let keys = Object.keys(this.assets)

    for (let i=0; i < keys.length; i++) //dont retrieve stocks that already exist 
      { 
        if (asset==keys[i])
        {
        chached = true
        break
        }
      }

    if (chached) // keep previous data as is 
      continue 
    
    let docRef = doc(db, "stocks", asset);
    const stockDoc = await getDoc(docRef);
    let data = stockDoc.data();
    this.assets[asset] = data;
    }
  },
  async getPortfolioDoc(){
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;

    let docRef = doc(db, "users", userID);
    const stockDoc = await getDoc(docRef);
    let data = stockDoc.data();
    return data
  },
  decodePortfolio(encodedStr) {
      console.log("encodedStr: ", encodedStr)
      const entries = encodedStr.split(';').map(entry => entry.split(':'));
      const portfolio = {};
      for (const [stock, percentage] of entries) {
          portfolio[stock] = parseInt(percentage);
      }
      console.log("decoded portfolio: ", portfolio)
      return portfolio;
  },

    updateAssets()
  {   this.startDate = this.startDateObj.toISOString().split('T')[0]; //convert from Date 
      this.endDate = this.endDateObj.toISOString().split('T')[0];
    this.fetchData().then(async () => 
{   
    let data = []

    for (const asset of this.portfolio? this.assetNamesWithPortfolio : this.assetsNames) {
      let prices = Object.values(toRaw(this.assets)[asset])
      let stockData = []

      let datesList = this.makeDateList(Object.keys(toRaw(this.assets)[asset])) //get all dates
      let datesListCropped
      datesListCropped = datesList.filter(
        day => {let dateObj = new Date(day); return dateObj >= new Date(this.startDate) && dateObj <= new Date(this.endDate);})

      console.log("crop", datesListCropped) // TODO see if that can be used elsewhere 


      if (this.normalize ) //find first non NaN value and divide every number by it
      {
        //find first non NaN value 
        let basePrice = 1
        for (let i = 0; i < prices.length; i++) 
        {
          if (!isNaN(toRaw(prices[i]))  &&  new Date (datesList[i]) >= new Date(this.startDate)) 
          {
            basePrice = toRaw(prices[i])
            break;
          }
        }        
        prices = toRaw(prices).map(x => (x/basePrice).toFixed(3)) //divide values in prices by basePrice by map & round to 3 dp
        
        
        for (let i = 0; i < datesList.length; i++) {      
          //let value = Object.values(toRaw(this.assets)[asset])[i]==="NaN" ? Number.NaN : Object.values(toRaw(this.assets)[asset])[i]
          //TODO take into account date range prop
          console.log("datesList[i]",new Date(datesList[i]))
          console.log("new Date(this.startDate)",new Date(this.startDate))
          console.log("new Date(this.endDate)",new Date(this.endDate))
          console.log(new Date(datesList[i])>= new Date(this.startDate) && datesList[i]<= new Date(this.endDate))
          if ( new Date(datesList[i])>= new Date(this.startDate) && new Date(datesList[i])<= new Date(this.endDate))
          {
          stockData.push([datesList[i], prices[i]==="NaN" ? Number.NaN : prices[i] ])             
          }
        }
            
      }
      else{
        let datesList = this.makeDateList(Object.keys(toRaw(this.assets)[asset]))
        let startdateObj  = new Date(this.startDate)
        let endDateObj = new Date(this.endDate)
        for (let i = 0; i < datesList.length; i++) {
          
          //let datei = datesList[i] redundant
          let dateiObj = new Date(datesList[i])
                    
          if ( dateiObj < startdateObj) continue; //do not add this date if before starting date
          if ( dateiObj > endDateObj) break; //do not add this date if after ending date

          let value = Object.values(toRaw(this.assets)[asset])[i]==="NaN" ? Number.NaN : Object.values(toRaw(this.assets)[asset])[i]
          stockData.push([datesList[i], value ])             
        }
      }
      data.push(
        {
          name: asset,
          dates: Object.keys(toRaw(this.assets)[asset]),
          prices: prices,
          data: stockData
        })
      
    }
    console.log(data[0])
    const options = {
              // Declare an x-axis (category axis).
              // The category map the first column in the dataset by default.
              xAxis: {type: 'time',
                      
                      //min: 'dataMin',
                      axisLabel: {formatter: '{yyyy}-{MM}-{dd}', hideOverlap: true,  padding: [0, 10, 0, 10], margin:10, fontSize: 11, },
                        axisTick: { 
                          alignWithLabel: true,  // Align ticks with labels
                        },                   
                    },
              // Declare a y-axis (value axis).
              yAxis: { type: 'value', name:"Price"},
              
              series: data.map(lineData => ({
                type: 'line',
                  connectNulls: true,
                  showSymbol: false, //removes dots on the chart
                  data: lineData.data, // Reference the y-axis values for each line TODO fix date issue
                  name: lineData.name, // Name for the line in tooltip
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

      portfolio(newValues, oldValues) { //if portfolio prop updates auto update graph
        if ((newValues !== oldValues) && oldValues !=null)
        {
          this.updateAssets()
        }
      },

  normalize(newValues, oldValues){ // if normalize prop updates auto update graph
    if ((newValues !== oldValues) && oldValues !=null )
    {
          this.updateAssets()
    }    
  },
  startDateObj(newValues, oldValues){
    if ((newValues !== oldValues) && oldValues !=null )
    {
      this.startDate = this.startDateObj.toISOString().split('T')[0]; //convert from Date 
      this.endDate = this.endDateObj.toISOString().split('T')[0];
          this.updateAssets()
    }    
  },
  endDateObj(newValues, oldValues){
    if ((newValues !== oldValues) && oldValues !=null )
    {
      this.startDate = this.startDateObj.toISOString().split('T')[0]; //convert from Date 
      this.endDate = this.endDateObj.toISOString().split('T')[0];
          this.updateAssets()
    }    
  },
  }
};
</script> 

<style scoped>
.card {
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
}
</style>
<template>
<h2>UNDER CONSTRUCTION</h2>
<h1>{{ $route.params.ticker }}</h1>
<h2>{{ getCompanyName($route.params.ticker) }}</h2>
<v-card elevated class="card-margin">
                <v-layout justify-center>                  
                             Price Today: EGP {{this.todayPrice}}
                             Daily Change:{{this.chg}}%
                             Earning per share: {{this.eps}}
                             Index: {{this.index}}
                             Industry: {{this.industry}}
                             Margin: {{this.margin}}
                             Profit: {{this.profit}}
                             price to book ratio: {{this.ptb}}
                             Rev: {{this.rev}}  
                             Dividend Yield: {{this.divYield}}%
                             Price/Earnings ratio: {{(this.todayPrice/this.eps).toFixed(2)}}                         
                </v-layout>
              </v-card>
              <PriceHistoryChart :assetsNames="[$route.params.ticker]" :normalize=false 
              :startDateObj="startDate" :endDateObj="endDate" :dateRange="dateRange" title="title" />
</template>


<script>    
import { getDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase/init";
import { toRaw } from 'vue';
import PriceHistoryChart from "/src/components/PriceHistoryChart.vue"

export default{

  data() {
    return {
      companyData: {},
      ticker: this.$route.params.ticker,
      data: null,
      chg: null,
      eps: null,
      index: null,
      industry: null,
      margin: null,
      profit: null,
      ptb: null,
      rev: null,
      divYield: null,
      todayPrice: null,
      startDate: new Date('2008-01-01'),
      endDate: new Date(), 
      dateRange: [new Date('2018-01-01'), new Date()],

    }
  },
  mounted() {
    
    import('../data/company_data.json').then(data => {
      this.companyData = data.default
      this.fetchData().then(() =>
      {    
        console.log(this.data)
        this.chg = ((this.data.chg)*100).toFixed(2)
        this.eps = ((this.data.eps)).toFixed(2)
        this.index = this.data.index
        this.industry = this.data.industry
        this.margin = (this.data.margin).toFixed(2)
        this.profit = (this.data.profit)
        this.ptb = (this.data.ptb).toFixed(2)
        this.rev = (this.data.rev).toFixed(2)
        this.divYield = (this.data.div_yield).toFixed(2)
        this.todayPrice = Object.values(this.data).slice(-11)[0]
      }
      )
      
    })
    
  },
  components: {
    //BarChart,
    PriceHistoryChart
  },
  methods:
  {
    getCompanyName(symbol) 
    {    
        return this.companyData[symbol]         
    },

    async fetchData() {
  
    
    let docRef = doc(db, "stocks", this.ticker);
    const stockDoc = await getDoc(docRef);
    this.data = stockDoc.data();
    console.log(toRaw(this.data))
    
  },


  }
}
</script>


<style>

</style>
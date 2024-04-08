<template>
 <v-container fluid fill-height >
    <div class="font">      
      {{ title }}  
    </div>    
    <div :id="`bar-chart${title}`" style=" height: 100%"></div>
  </v-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: ["labels", "values", "title"],
  data() {
    return {
      chartId: 0, // Initialize a counter; unneeded
    };
  },

  watch: {
    values: {
      handler: function(newValues, oldValues) {
        if ((newValues !== oldValues) && oldValues) {
          //console.log("values changed")
          const options = {
          grid: {
            //left: "30%",
          },
          barWidth: "40%",
          visualMap: {
            show: false, //removes the postive negative legend
            type: "piecewise",
            dimension: 0,
            pieces: [
              { gt: 0, color: "#09467d" }, // Blue for positive values (> 0)
              { lte: 0, color: "#A40000" }, // Red for negative values (<= 0)
            ],
          }, 

          dataZoom: [
            {
              type: "slider",
              yAxisIndex: 0,
              zoomLock: false,
              width: 20,
              right: 5,
              minValueSpan: 3, //min # of bars to show
              maxValueSpan: 50,
              startValue: 0, //start and end represent the # bars of chart to show by default
              endValue: 20,
              handleSize: 20,
              showDetail: false,
            },
          ],

          xAxis: {
            type: "value",
            show: false,
            axisLine: { show: true },
            splitLine: { show: false },
          },
          yAxis: {
            type: "category",
            data: this.labels,
            inverse: false,
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 0,
              //padding: 10,
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "Cursive",
            },

            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          series: [
            {
              data: this.values,
              type: "bar",
              barWidth: "50%",
              fontWeight: "bold",
              fontFamily: "Cursive",
              itemStyle: {
            //barBorderRadius: [5, 5, 5, 5],
                borderRadius : 5
              },
              label: {
                show: true,
                position: "right",
                formatter: "{c}%",
                fontSize: 15,
              },
              emphasis: {
                itemStyle: {
                  barWidth: "6000%",
                },
              },
            },
          ],
        };
        // set new options to the chart
        const chart = echarts.getInstanceByDom(document.getElementById(["bar-chart" + this.title]))
        
        if(chart){
          chart.setOption(options)}      
        
        }
      },
      deep: true, // This ensures that changes within the array are detected
      immediate: true,
    },
  },


  mounted() {
    window.addEventListener('resize', this.handleResize); //this is to handle zoom in/out from browser
    this.chartId++;
    const chartDom = document.getElementById(["bar-chart" + this.title]);
    const myChart = echarts.init(chartDom);
    // Sort the data array based on values in descending order
    //const sortedValues = this.values.slice().sort((a, b) => a - b); //data should be sorted in input

    const options = {
      grid: {
        //left: "1%",
      },
      barWidth: "40%",
      visualMap: {
        show: false, //removes the postive negative legend
        type: "piecewise",
        dimension: 0,
        pieces: [
          { gt: 0, color: "#09467d" }, // Blue for positive values (> 0)
          { lte: 0, color: "#A40000" }, // Red for negative values (<= 0)
        ],
      }, // Update the labelStyle for xAxis and yAxis in the mounted function of BarChart.vue

      dataZoom: [
        {
          type: "slider",
          yAxisIndex: 0,
          zoomLock: false,
          width: 20,
          right: 5,
          minValueSpan: 3, //min # of bars to show
          maxValueSpan: 50,
          startValue: 0, //start and end represent the # bars of chart to show by default
          endValue: 15,
          handleSize: 20,
          showDetail: false,
        },
      ],

      xAxis: {
        type: "value",
        show: false,
        axisLine: { show: true },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: this.labels,
        inverse: false,
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 0,
          //padding: 10,
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "Cursive",
        },

        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          data: this.values,
          type: "bar",
          barWidth: "50%",
          fontWeight: "bold",
          fontFamily: "Cursive",
          itemStyle: {
            //barBorderRadius: [5, 5, 5, 5],
            borderRadius : 5
          },
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            fontSize: 15,
          },
          emphasis: {
            itemStyle: {
              barWidth: "6000%",
            },
          },
        },
      ],
    };

    myChart.setOption(options);
  },
  methods: {
  handleResize() {
    const chart = echarts.init(document.getElementById(`bar-chart${this.title}`)) //this is to handle zoom in/out from browser
    chart.resize();
  }
}
};
</script>

<style scoped>
.font {
  /*position: absolute;*/
  /*top: 0;*/
  color: rgba(21, 25, 88, 0.971); 
  /*margin-bottom: -50px; /*space between chart title and chart */
  font-weight: bold;
  /*text-align: right;*/
}
</style>
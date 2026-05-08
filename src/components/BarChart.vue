<template>
  <div class="blank-space"></div>
  <div class="title" style="margin-left: 35px; width: 85%; height: 8%">
    {{ title }}
  </div>
  <v-container fluid fill-height>

    <div class="blank-space"></div>
    <th>{{ maxBarValue }}</th>

    <v-chart class="chart" :option="chartOption" autoresize style="width: 100%; min-height: 420px" />
  </v-container>
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart as EChartsBarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { stockTickersDict } from '../data/stockTickers.js';

use([
  CanvasRenderer,
  EChartsBarChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  DataZoomComponent
]);

export default {
  name: "BarChart",
  components: {
    VChart
  },
  props: ["labels", "values", "title", "dataZoom"],
  data() {
    return {
      //  chartId: 0, // Initialize a counter; unneeded
      stockTickersDict: stockTickersDict
    };
  },
  computed: {
    maxBarValue() {
      // Retaining this since it was in the original template
      return '';
    },
    chartOption() {
      const options = {
        grid: {
          left: "left",
          top: "top",
          responsive: true,
          right: "10%",
          bottom: "0%",
          containLabel: true,
        },

        tooltip: {
          show: true,
          formatter: (params) => {
            const barName = params.name;
            const value = params.value;
            const extraInfo = this.stockTickersDict[barName] || barName;
          return `<b>${extraInfo}</b><br/>` + `Value: ${value}%<br/>`;
        },
        visualMap: {
        show: false, //removes the postive negative legend
          type: "piecewise",
          dimension: 0,
          pieces: [
          { gt: 0, color: "#60bb59" }, // Green for positive values (> 0)
          { lte: 0, color: "#de4343" }, // Red for negative values (<= 0)
          ],
      }, // Update the labelStyle for xAxis and yAxis in the mounted function of BarChart.vue

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
        axisLabel: { // the stock ticker label 
            show: true,
            inside: false,
            interval: 0,
            rotate: 0,
          //padding: 10,
            fontSize: 17,
            fontWeight: "bold",
            fontFamily: "Cascadia code",
            color: "#5a5f6e",
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
          fontFamily: "Cascadia code",
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              show: true,
              position: "right",
              formatter: "{c}%",
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "Cascadia code",
              color: "#818691",
            },
            emphasis: {
              itemStyle: {
                barWidth: "6000%",
              },
            },
          },
        ],
      };

      if (this.dataZoom) {
        options.dataZoom = {
          type: "slider",
          yAxisIndex: 0,
          zoomLock: false,
          width: 20,
          right: 5,
        minValueSpan: 3, //min # of bars to show
          maxValueSpan: 31,
        startValue: 0, //start and end represent the # bars of chart to show by default
          endValue: 15,
          handleSize: 20,
          showDetail: false,
        };
      }

      return options;
    }
  }
};
</script>

<style scoped>
.title {
  /*position: absolute;*/
  /*top: 0;*/
  color: rgba(21, 25, 88, 0.971);
  /*margin-bottom: -50px; /*space between chart title and chart */
  font-weight: bold;
  height: 100px;
  width: 250px;
  font-size: 30px;
  font-family: Cascadia code;
  /* background-color: #a29cb8; */
  border-radius: 12pc;
  /*text-align: right;*/
}
.blank-space {
  height: 20px; /* Adjust the height value to add blank space */
}
</style>

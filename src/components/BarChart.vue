<template>
  <div class="chart">
    <div class="blue-background">
      {{ title }}
    </div>
    <div :id="`bar-chart${title}`" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: ["labels", "values", "title"],
  data() {
    return {
      chartId: 0, // Initialize a counter unneeded
    };
  },
  mounted() {
    this.chartId++;
    console.log("bar-chart" + this.title);
    const chartDom = document.getElementById(["bar-chart" + this.title]);
    const myChart = echarts.init(chartDom);

    const options = {
      grid: {
        left: "30%",
      },
      barWidth: '40%',
      visualMap: {
        type: "piecewise",
        dimension: 0,
        pieces: [
          { gt: 0, color: "#09467d" }, // Blue for positive values (> 0)
          { lte: 0, color: "#A40000" }, // Red for negative values (<= 0)
        ],
      }, // Update the labelStyle for xAxis and yAxis in the mounted function of BarChart.vue
      labelOption: {
        fontSize: 200, // Change the font size to 14px or any desired size
        color: "#A40000",
      },

      dataZoom: 
      [
        {
          type: 'slider',
          yAxisIndex: 0,
          zoomLock: false,
          width: 20,
          right: 5,
          minValueSpan: 3,//min # of bars to show
          maxValueSpan: 50,
          startValue: 0, //start and end represent the # bars of chart to show by default
          endValue: 4,
          handleSize: 20,
          showDetail: false,

        }
      ],


      xAxis: {
        type: "value",
        axisLine: { show: true },
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
          crossAlign: "far",
          fontSize: 30,
        },

        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          data: this.values,
          type: "bar",
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            fontSize: 30,
            labelSize: 30,
          },
        },
      ],
    };

    myChart.setOption(options);
  },
};
</script>

<style scoped>
.blue-background {
  background-color: #09467d; /* Blue background */
  color: white; /* White text color */
}
</style>

<template>
<div class="chart">
  <div class="blue-background">
    {{title}} 
  </div>
    <div :id="`bar-chart${title}`" style="width: 100%; height: 400px;"></div>  
 </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
  props: ['labels','values','title'],
  data() {
    return {
      chartId: 0, // Initialize a counter
    };
  },
  mounted() {
    this.chartId++;
    console.log('bar-chart'+this.title)
    const chartDom = document.getElementById(['bar-chart'+this.title]);
    const myChart = echarts.init(chartDom);

    const options = {
      visualMap: {
        type: 'piecewise',
        dimension: 0,
        pieces: [
        { gt: 0, color: '#09467d' },  // Blue for positive values (> 0)  
        { lte: 0, color: '#A40000' } // Red for negative values (<= 0)
          
        ],
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: this.labels,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          data: this.values,
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
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
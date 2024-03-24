<template>
    <div class="chart">
      <div class="blue-background">Gainers/losers</div>  
  <div id="pie-chart" style="width: 100%; height: 400px;"></div>  
    </div>
</template>


<script>
import * as echarts from 'echarts';
export default {
  name: 'PieChart',
  props:['gainers','losers'],
  mounted() {
    const chartDom = document.getElementById('pie-chart');
    const myChart = echarts.init(chartDom);

    const options = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  series: [
    {
      name: 'Gainers and Losers',
      type: 'pie',
      radius: ['00%', '50%'],
      avoidLabelOverlap: true,
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {c} ({d}%)',
        textStyle: {
          color: '#000',
        },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold',
        },
      },
      data: [
        { value: this.gainers, name: 'Gainers', itemStyle: { color: '#09467d' } }, // Blue
        { value: this.losers, name: 'Losers', itemStyle: { color: '#e1e1e1' } }, // Grey
      ],
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
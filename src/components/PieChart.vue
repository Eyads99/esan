<template>
  <div class="chart">
    <div :id= "`pie-chart${ID}`" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PieChart",
  props: ["gainers", "losers","ID"],
  mounted() {
    //window.addEventListener('resize', this.handleResize); //this is to handle zoom in/out from browser
    this.chartId++;
    const chartDom = document.getElementById(["pie-chart" + this.ID]);
    const myChart = echarts.init(chartDom);

    const options = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Gainers and Losers",
          type: "pie",
          radius: ["00%", "50%"],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c} ({d}%)",
            textStyle: {
              color: "#000",
              fontFamily: "Cursive",
              fontSize: "15",
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "15",
              fontWeight: "bold",
            },
          },
          data: [
            {
              value: this.gainers,
              name: "Gainers",
              itemStyle: { color: "#09467d" },
            }, // Blue
            {
              value: this.losers,
              name: "Losers",
              itemStyle: { color: "#e1e1e1" },
            }, // Grey
          ],
        },
      ],
    };

    myChart.setOption(options);
  },

  methods: {
  handleResize() {
    //const chart = echarts.init(document.getElementById(`bar-chart${this.title}`));
    //chart.resize();
  }
},

data() {
    return {
      chartId: 0, // Initialize a counter unneeded
    };
  },
};
</script>

<style scoped>
.blue-background {
  background-color: #09467d; /* Blue background */
  color: white; /* White text color */
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
</style>

<template>
  <div class="chart">
    <div :id="`pie-chart${ID}`" style="height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "PieChart",
  props: ["gainers", "losers", "ID"],

  watch: {
    gainers(newValues, oldValues) {
      if (newValues !== oldValues && oldValues) {
        this.updateChart();
      }
    },

    losers(newValues, oldValues) {
      if (newValues !== oldValues && oldValues) {
        this.updateChart();
      }
    },
  },

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
      grid: {
        left: "left",
        top: "top",
        right: "10%",
        bottom: "0%",
        containLabel: true,
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
            color: "#000",
            fontFamily: "Cascadia code",
            fontSize: "20",
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: "bold",
            },
          },
          data: [
            {
              value: this.gainers,
              name: "Gainers",
              itemStyle: { color: "#0652c5" },
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
    },
    updateChart() {
      const options = {
        grid: {
          left: "left",
          top: "top",
          right: "10%",
          bottom: "0%",
          containLabel: true,
        },
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
                color: "black",
                fontFamily: "Cascadia code",
                fontWeight: "bold",
                fontSize: "28",
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
                itemStyle: { color: "#0652c5" },
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
      const chartDom = document.getElementById(["pie-chart" + this.ID]);
      const myChart = echarts.init(chartDom);

      if (myChart) {
        myChart.setOption(options);
      }
    },
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
  font-family: "Cascadia code";
}
</style>

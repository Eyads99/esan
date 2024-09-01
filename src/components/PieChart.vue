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

    "$i18n.locale"(newLocale, oldLocale) {
      if (newLocale !== oldLocale) {
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
        bottom: "5%",
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
            formatter: "{b}: {c} ", //({d}%) remove percentage from label
            color: "#000",
            fontFamily: "Cascadia code",
            fontSize: "18",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              //fontWeight: "bold",
            },
          },
          data: [
            {
              value: this.gainers,
              name: this.$t('Gain'),
              itemStyle: { color: "#0652c5" },
            }, // Blue
            {
              value: this.losers,
              name: this.$t('Loss'),
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

            data: [
              {
                value: this.gainers,
                name: this.$t('gainers'),
                itemStyle: { color: "#0652c5" },
              }, // Blue
              {
                value: this.losers,
                name: this.$t('losers'),
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

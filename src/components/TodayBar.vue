<template>
  <table id="TodayBar">
    <tr class="title">
      <th :style="{ color: getColor(dailyChange) }">{{ dailyChange }}%</th>
      <th>{{ currentPoints }}</th>
      <th :style="{ color: getColor(YtDate) }">{{ YtDate }}%</th>
    </tr>
    <tr>
      <td>daily change</td>
      <td>current points</td>
      <td>year-to-date performance</td>
      <br />
    </tr>
  </table>
</template>

<script>
export default {
  name: "TodayBar",
  props: {
    dailyChange: {
      //type: Number,
      required: true,
    },
    currentPoints: {
      //type: Number,
      required: true,
    },
    YtDate: {
      //type: Number,
      required: true,
    },
  },

  methods: {
    getColor(value) {
      return value < 0 ? "red" : value > 0 ? "green" : "black"; //-ive -> red +ive -> green 0 -> black
    },
  },
  computed: { // redunant code rouding done in prop
    roundedValue1() {
      return Math.round(this.dailyChange * 10) / 10;
    },
    roundedValue2() {
      return Math.round(this.currentPoints);
    },
    roundedValue3() {
      return Math.round(this.YtDate * 100) / 100;
    },
  },
};
</script>

<style scoped>
#TodayBar {
  border-collapse: collapse;
}
#TodayBar th,
#TodayBar td {
  padding-left: 70px;
}
.title {
  font-size: xx-large;
}
</style>

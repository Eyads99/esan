<template>
  <v-table
    style=" text-align: center; padding-left: 0px"
    id="TodayBar"
  >
    <tr class="title">
      <th :style="{ color: getColor(dailyChange) }">{{ dailyChange }}%</th>
      <th>{{ currentPoints }}</th>
      <th :style="{ color: getColor(YtDate) }">{{ YtDate }}%</th>
    </tr>
    <tr>
      <td>
        <span style="font-size: 18px" class="highlight">Daily Change</span>
      </td>
      <td>
        <span style="font-size: 18px" class="highlight">Current Points</span>
      </td>
      <td>
        <span style="font-size: 18px" class="highlight">YTD performance</span>
      </td>
    </tr>
  </v-table>
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
      return value < 0 ? "#fc6075" : value > 0 ? "#66996c" : "black"; //-ive -> red +ive -> green 0 -> black
    },
  },
  computed: {
    // redunant code rouding done in prop
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
  padding-left: 0px;
}
.title {
  font-size: 25px;
}
.highlight {
  color: #5a5f6e;
  font-weight: bold;
}
</style>

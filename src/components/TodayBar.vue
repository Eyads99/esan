<template>
    <table id="TodayBar">
        <tr class="title">
          <th :style="{color: getColor(dailyChange)}" >{{dailyChange}}%</th>
          <th>{{currentPoints}}</th>
          <th :style="{color: getColor(YtDate)}" >{{YtDate}}%</th>
        </tr>
        <tr>
          <td>Daily Change</td>
          <td>Current Points</td>
          <td>YtDate</td>
       </tr>
    </table> 
</template>

<script>
export default {
    name: 'TodayBar',
    props: ['dailyChange','currentPoints','YtDate'],
    methods: {
      getColor(value) {
      return value < 0 ? 'red' : value>0 ? 'green' : 'black'; //-ive -> red +ive -> green 0 -> black
    }
    }

}

</script> 

<style scoped>
.title {
  font-size: xx-large;
}

</style>

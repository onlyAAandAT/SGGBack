<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barCharts",
  mounted() {
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    // 配置数据
    barCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10,7,33,12,48,9,29,10,44,33,22,8],
          color:"blue"
        },
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{},
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
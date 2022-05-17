<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progerssCharts",
  mounted() {
    // 初始化echarts实例
    let progerssCharts = echarts.init(this.$refs.charts);
    // 配置数据
    progerssCharts.setOption({
      xAxis: {
        show: false,
        // 最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
        },
      ],
      label:{
        show:true,
        formatter:'|',
        position:'right'
      },
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
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
<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售类别占比</span>
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="paicharts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    // 饼图
    let mychart = echarts.init(this.$refs.charts);
    mychart.setOption({
      title: {
        text: "",
        subtext: "",
        left: "center",
        top: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "搜索引擎" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "邮件营销" },
          ],
        },
      ],
    });
    // 绑定事件
    mychart.on("mouseover", (params) => {
      const { name, value } = params.data;
      mychart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paicharts {
  width: 100%;
  height: 300px;
}
</style>
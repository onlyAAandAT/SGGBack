<template>
  <!--  @tab-click="handleClick" -->

  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
        <!-- 头部左侧内容 -->
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 时间范围 -->
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="right_title">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>肯德基</span>
                <span class="rvalue">114514</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      // 日历
      date: [],
    };
  },
  computed: {
    // 标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  methods: {
    saleCharts() {
      this.mycharts = echarts.init(this.$refs.charts);
      this.mycharts.setOption({
        title: {
          text: "销售额趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
    visiteCharts() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.userFullYear,
            color: "blue",
          },
        ],
      });
    },
    handleClick(tab, event) {
      if (this.activeName == "visite") {
        this.visiteCharts();
      } else {
        this.saleCharts();
      }
    },
    // 今日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 今年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  // 一开始没有数据，要监听
  watch:{
    listState(){
      this.saleCharts();
    }
  }
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right .date {
  width: 400px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.right_title h3 {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
ul li span {
  margin: 0px 10px;
}
.rindex {
  float: left;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgb(255, 246, 196);
  color: rgb(243, 0, 101);
  text-align: center;
}
.rvalue {
  float: right;
}
>>> .el-card__header {
  border-bottom: none;
}
</style>
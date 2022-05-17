<template>
  <el-card>
    <div slot="header" class="search-header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <i class="el-icon-more el-dropdown-link"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>1</el-dropdown-item>
          <el-dropdown-item>1</el-dropdown-item>
          <el-dropdown-item>4</el-dropdown-item>
          <el-dropdown-item>5</el-dropdown-item>
          <el-dropdown-item>1</el-dropdown-item>
          <el-dropdown-item>4</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="search-body">
      <el-row :gutter="10">
        <el-col :span="12"><LineCharts></LineCharts></el-col>
        <el-col :span="12"><LineCharts></LineCharts></el-col>
      </el-row>
    </div>
    <!-- table -->
    <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" align="center" label="排名" width="80">
      </el-table-column>
      <el-table-column label="搜索关键字" width="180"> </el-table-column>
      <!-- :formatter="formatter" -->
      <el-table-column label="用户数" sortable> </el-table-column>
      <el-table-column label="周涨幅" sortable> </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination layout="prev, pager, next" :total="1000" class="pagination"> </el-pagination>
  </el-card>
</template>

<script>
import LineCharts from "./lineChart";
export default {
  name: "",
  data() {
    return {
      tableData: [{}, {}],
    };
  },
  components: { LineCharts },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.el-dropdown-link {
  cursor: pointer;
}
.pagination{
  float: right;
}
</style>
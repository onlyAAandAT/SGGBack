<template>
  <!-- inline:代表的是行内表单，代表一行可以放置多少个表单元素 -->
  <el-form :inline="true" class="demo-form-inline" :model="cForm">
    <el-form-item label="一级分类">
      <el-select
        placeholder="请选择"
        v-model="cForm.category1Id"
        @change="handler1"
        :disabled="show"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="(c1, index) in list1"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类" :model="cForm">
      <el-select
        placeholder="请选择"
        v-model="cForm.category2Id"
        @change="handler2"
        :disabled="show"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="(c2, index) in list2"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        placeholder="请选择"
        v-model="cForm.category3Id"
        @change="handler3"
        :disabled="show"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="(c3, index) in list3"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelect",
  // 组件挂载完毕就要发请求，获取相应的以及分类数据
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集相应的一级二级三级分类id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  // 根据父组件是否点击了添加属性按钮进行禁止操作三级联动
  props:["show"],
  mounted() {
    // 获取一级分类数据
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handler1() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const { category1Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category1Id,level:1});
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category2Id,level:2});
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    async handler3() {
        const { category3Id } = this.cForm;
        this.$emit("getCategoryId", {categoryId:category3Id,level:3});
    },
  },
};
</script>

<style>
</style>
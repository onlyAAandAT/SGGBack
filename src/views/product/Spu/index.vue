<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- spu列表展示 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU
        </el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- el-tag展示属性 -->
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加spu"
              ></hint-button>
              <hint-button
                @click="updateSpu(row)"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></hint-button>
              <!-- 气泡确认框 -->
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center; margin-top: 20px"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 父组件获取子组件 -->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm v-show="scene == 2"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 场景：0:spu列表展示，1:spu添加|spu修改，2：添加sku
      scene: 0,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // Spu列表获取参数
      page: 1,
      limit: 3,
      records: [],
      total: 0, // 分页器一共需要展示数据的条数
    };
  },
  methods: {
    // 自定义事件回调 获取3个分类id
    getCategoryId({ categoryId, level }) {
      // level 区分三级分类对应的id，以及对数据的清除
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 发请求获取
        this.getSpuList();
      }
    },
    // 获取Spu列表
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      // 携带三个参数：page第几页、limit每页展示多少条数据、三级分类的id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 分页器的展示数据条数变化
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu按钮的点击回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求，获取品牌与销售属性
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改Spu
    updateSpu(row) {
      this.scene = 1;
      // ref获取子组件上的方法
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件改变场景回调,flag判断保存还是修改操作
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        // 父组件切场景后更新,分页器停留
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除SPU按钮
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if(result.code == 200){
        this.$message({type:"success",message:"删除Spu成功"})
      }else{
        this.$message("删除Spu失败")
      }
      this.getSpuList(this.records.length>1?this.page:this.page-1);
    },
  },
};
</script>

<style>
</style>
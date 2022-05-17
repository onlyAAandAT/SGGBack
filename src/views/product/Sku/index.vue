<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="height: 80px; width: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            title="下架"
            @click="cancelSale(row)"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 1"
          ></el-button>
          <el-button
            type="success"
            title="上架"
            @click="sale(row)"
            icon="el-icon-top"
            size="mini"
            v-else
          ></el-button>
          <el-button
            type="primary"
            title="你敢点我就敢弹"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            title="sku详细信息"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">
          <!-- <div class="grid-content bg-purple"></div> -->
          名称
        </el-col>
        <el-col :span="16">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          {{ skuInfo.skuName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <!-- <div class="grid-content bg-purple"></div> -->
          描述
        </el-col>
        <el-col :span="16">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          {{ skuInfo.skuDesc }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <!-- <div class="grid-content bg-purple"></div> -->
          价格
        </el-col>
        <el-col :span="16">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          {{ skuInfo.price }} 元
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <!-- <div class="grid-content bg-purple"></div> -->
          平台属性
        </el-col>
        <el-col :span="16">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }} - {{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <!-- <div class="grid-content bg-purple"></div> -->
          商品图片
        </el-col>
        <el-col :span="16">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          <div class="block">
            <el-carousel height="400px">
              <el-carousel-item
                v-for="(item, index) in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 5,
      // 返回的sku列表数据
      records: [],
      total: 0,
      // 弹窗sku信息存储
      skuInfo: {},
      // 抽屉相关
      drawer: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku列表
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    handleCurrentChange(page) {
      this.getSkuList(page);
    },
    // 令sku上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        row.isSale = 1;
      }
    },
    // 令sku下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        row.isSale = 0;
      }
    },
    // 玩
    edit() {
      this.$message("正在开发中");
    },
    // info按钮弹窗
    async getSkuInfo(sku) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>


<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

>>> .el-carousel__button {
  height: 10px;
  width: 10px;
  background-color: rgb(0, 255, 213);
  border-radius: 50%;
}
</style>
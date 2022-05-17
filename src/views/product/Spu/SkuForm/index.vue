<template>
  <div>
    <el-form ref="form" label-width="80px">
      <!-- 标题 -->
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <!-- 规格描述 -->
      <el-form-item label="规格描述">
        <el-input
          placeholder="规格描述"
          type="textarea"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <!-- 注意：下面v-model直接向对象中添加的属性不会被Vue监测 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <!-- 注意：下面的v-mode添加的数据不会被Vue监测 -->
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- table -->
      <el-form-item label="图片列表">
        <!-- 
              :data="tableData"
              
           -->
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
          :data="spuImageList"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column label="图片" width="250">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="250">
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 平台属性数据
      attrInfoList: [],
      // 收集sku数据提交字段
      skuInfo: {
        category3Id: 0,
        isSale: 0,
        price: 0,
        skuAttrValueList: [],
        // 默认图片
        skuDefaultImg: "",
        skuDesc: "",
        // 收集图片的字段
        skuImageList: [],
        skuName: "",
        skuSaleAttrValueList: [],
        spuId: 0,
        tmId: 0,
        weight: "",
      },
      spu: {},
      // 记录多选框返回,被选中的一行会返回他的row，并且是通过对象存放在数组中
      imageList: [],
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // table复选框事件
    handleSelectionChange(params) {
      this.imageList = params;
      // 收集到的数据需要处理，添加相应的字段isDefault
    },
    // 获取skufrom数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 第二类：需要通过数据的双向绑定展示
      this.spu = spu;
      let result1 = await this.$API.spu.reqSpuImageList(spu.id);
      if (result1.code == 200) {
        let list = result1.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性数据
      let result2 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result2.code == 200) {
        this.spuSaleAttrList = result2.data;
      }
      // 获取平台属性的数据
      let result3 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result3.code == 200) {
        this.attrInfoList = result3.data;
      }
    },
    // 设置为默认按钮的排他操作
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集被点击后的默认图片信息
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // cancel取消返回场景0，清空表单
    cancel() {
      // 自定义事件触发
      this.$emit("changeScenes", 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮事件
    async save() {
      // 整理参数
      // 整理平台属性 attrInfoList
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      // 整理平台属性的数据方式1
      // // 新建数组
      // let arr = [];
      // attrInfoList.forEach((item) => {
      //   // 当前平台属性，用户进行了选择
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(":");
      //     // 携带给服务器的参数应该是对象
      //     let obj = { valueId, attrId };
      //     arr.push(obj);
      //   }
      // });
      // // 将整理好的数据放入
      // skuInfo.skuAttrValueList = arr;

      // 方式二
      // 整理平台属性select
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性select
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })

      let result = await this.$API.spu.reqAddSku(skuInfo);
      if(result.code==200){
        this.$message({type:'success',message:'添加Sku成功'});
        this.$emit('cahngeScenes',0);
      }
    },
  },
};
</script>

<style>
</style>
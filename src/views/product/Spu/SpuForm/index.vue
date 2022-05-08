<template>
  <!-- form表单 -->
  <div>
    <el-form ref="form" label-width="80px">
      <!-- SPU名称输入框 -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU的名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <!-- 品牌下拉多选框 -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- SPU描述文本框 -->
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- SPU图片（照片墙）多图片上传 -->
      <el-form-item label="SPU图片">
        <!-- 
          file-list：照片墙上传的数组，元素需带有name和url

         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性及其表格 -->
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}项属性未选择`"
          v-model="attrIdAndattrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndattrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- el-talbe展示当前Spu属于自己的销售属性 -->
        <el-table
          style="width: 100%; margin-top: 5px"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column
            prop="saleAttrValueName"
            label="属性值名称列表"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.native.enter="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 俩按钮 -->
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 收集未选择的销售属性id
      attrIdAndattrName: "",
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu的信息，考虑到会用spu向服务器发请求，因此spu结构写全
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // spu名称
        spuName: "",
        // 平台id
        tmId: "",
        // Spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌的信息
      tradeMarkList: [],
      // 存储spu图片信息
      spuImageList: [],
      // 存储销售属性
      saleAttrList: [],
    };
  },
  computed: {
    // 计算出未选择的销售属性
    unSelectSaleAttr() {
      // 一共3个
      // 当前Spu拥有的属于自己的销售属性
      // 数组的过滤方法
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    // 照片墙删除图片触发
    handleRemove(file, fileList) {
      // file:删除的图片
      // fileList:删除图片后剩余的图片
      // console.log(file, fileList);
      // 收集照片墙图片删除后的剩余图片
      // 照片墙中显示的图片是有name和url字段，因为照片墙显示数据务必要有这两个属性
      // 对于服务器，不需要name和url字段，需后续处理
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取Spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 使用照片墙要有name和url字段，要修改数组
        listArr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // response.data是图片在服务器上的地址
      this.spuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 收集的销售属性的数据进行分割,解构获取，等号右边的数据类型对应解构的类型
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndattrName.split(":");
      // 收集
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 添加销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 添加完之后清空
      this.attrIdAndattrName = "";
    },
    // 添加tag按钮的回调
    addSaleAttrValue(row) {
      // 点击后有button转变为input，row.inputVisible控制,但没有的情况下需要添加
      this.$set(row, "inputVisible", true);
      // 添加销售属性值
      this.$set(row, "inputValue", "");
    },
    // tag失焦事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 新增销售属性值的筛选
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      if (result) {
        this.$message("属性值不能重复");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      if (inputValue) {
        row.spuSaleAttrValueList.push(newSaleAttrValue);
      }
      row.inputVisible = false;
      row.inputValue = "";
    },
    // 保存按钮回调，修改或新增
    async addOrUpdateSpu() {
      // 整理参数:照片墙
      // 携带的参数：对于图片，需要携带imgUrl,imgName
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        // 回场景
        this.$emit("changeScene", {scene:0,flag:this.spu.id?"修改":"添加"});
        Object.assign(this._data,this.$options.data());
      }
    },
    // 父组件点击SPU添加按钮后发请求
    async addSpuData(category3Id) {
      // 三级分类id收集
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      // 清数据
      // Object.assign(A,B) 合并对象，对象B被合并到对象A中
      // 组件实例this._data 可以操作data中的响应式数据
      // $options.data() 当前组件的配置对象下的data函数
      // data函数执行，返回空的响应式数据，将其赋值给_data即可
      
      Object.assign(this._data,this.$options.data());
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
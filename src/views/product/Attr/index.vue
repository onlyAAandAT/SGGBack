<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" :disabled="!category3Id"
          @click="addAttr">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- el-tag展示属性 -->
            <template slot-scope="{ row, $index }">
              <el-tag type="success" style="margin: 5px 10px" v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>
        <el-button>取消</el-button>
        <el-table :data="attrInfo.attrValueList" style="width: 100%; margin: 20px 0px" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)"
                @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm @onConfirm="deleteAttrValue($index)" :title="`确定删除${row.valueName}吗？`">
                <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr()" :disabled="attrInfo.attrValueList.length<1||attrInfo.attrValueList[attrInfo.attrValueList.length-1].valueName==''">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中的深拷贝函数
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的字段
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 新增属性存放|修改属性存放,具体参数含义去api看
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 自定义事件回调 获取3个分类id
    getCategoryId({ categoryId, level }) {
      // 区分三级分类对应的id，以及父组件进行存储
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
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    // 用户确定了三级分类的数据，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值按钮
    // 点击了添加属性值的按钮后，就应该分配到一个id
    addAttrValue() {
      // 向属性值数组里添加元素
      // attrId是相应属性的id，后续由服务器赋值
      // valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础之上新增属性值（新增时要把已有的属性的id带上
        valueName: "",
        flag: true,
      });
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除数据
      // 收集三级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改按钮
    updateAttr(row) {
      // row获取了数据
      this.isShowTable = false;
      // 将选中的属性row中的信息赋值给attrInfo
      // 复杂的对象深拷贝this.attrInfo = JSON.parse(JSON.stringify(row));
      // lodash也可以深拷贝
      this.attrInfo = cloneDeep(row);
      // flag标记添加
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag=false;不能这样赋值，直接赋值不会成为响应式数据
        this.$set(item, "flag", false);
      });
    },
    // 失焦
    toLook(row) {
      // row是当前用户添加的最新的属性值
      // input 消失 span显示

      // 如果用户输入值为空，不能作为新属性值
      if (row.valueName.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      // 新增的属性值不能与已有的重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组里面判断的时候去除,row是当前修改的或者添加的
        // 而遍历时会遍历到row，但row不能和row比
        if (row !== item) {
          // row不能自己比
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("属性值不能重复");
        return;
      }
      row.flag = false;
    },
    // 点击span回调变成编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // input节点是在点击之后瞬间才产生的，因此点击的时候无法获取到input的相关信息
      // 使用$nextTick等候浏览器渲染完毕后再执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框回调
    // 最新版本的elementUI的确认回调是confirm，旧版本是onConfirm
    deleteAttrValue(index) {
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 点击保存按钮，进行添加属性或者修改属性操作
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // fliter会返回一个新的数组，return的值是真的元素将会组成一个数组，需要接收
        // 过滤掉属性值不为空的
        if (item.valueName !== "") {
          // 属性值名称不为空
          // 删除掉flag属性，因为服务器需要的参数上没有这个参数
          delete item.flag;
          return true;
        }
      });
      // 完成过滤操作，发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" })
        // 保存成功后，更新平台属性展示
        this.getAttrList();
        // 这里的isShowTable防止的位置可能有问题，可以往前放？
        this.isShowTable = true;
      } catch (error) {
        this.$message({ message: "保存失败" });
      }
    }
  },
};
</script>

<style>
</style>
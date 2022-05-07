<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >

    <!-- 
        表格组件
        table
            data:表格组件将来需要展示的数据 数组类型
            border:表格添加边框
        colum
            label：列标题
            width：列宽度
            align：对齐方式
            prop：从data获取部分数据展示
        注意事项：
        1：elementUI当中的table组件，展示的数据是以一列一列进行展示数据


     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <!-- 作用域插槽回传 -->
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <!-- 作用域插槽回传 -->
          <!-- row是触发事件的对应品牌信息，涉及id操作的需要传入获取上传服务器 -->
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
        分页器
            当前第几页、数据总条数、每一页展示条数、连续页码数
            current-page:当前第几页
            total:代表分页器一共需要展示数据条数
            page-size:代表每一页需要展示的数据条数
            page-sizes:代表设置每一页战术数据的条数
            layout:分页器布局先后
            page-count:页码按钮数量，如果9，连续页码数是7
            小箭头:布局设置
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
     -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes, total"
      :total="total"
      :page-count="7"
      @current-change="getPageList"
      @size-change="getPageList"
    >
    </el-pagination>
    <!-- 
      对话框
      :visible.sync：控制对话框显示与隐藏
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
          form表单
            model属性：表单数据收集到到哪个对象上
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <!-- 
              图片的收集不能用v-model，因为不是表单元素
              action属性：设置图片上传的地址
              /admin/product/fileUpload 什么类型的请求都有
              由于上传图片时elementUI发送的请求，不会加上dev-api的配置，因此补上
              :on-success:可以检测到图片上传成功，当图片上传成功会执行一次
              :before-upload：可以在图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validatetmName = (rule, value, callback) => {
      // value 用户输入的文本
      // rule校验规则
      // callback放行函数
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("品牌名称需要2到10位"));
      } else {
        callback();
      }
    };
    return {
      // 分页器的第几页
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      dialogFormVisible: false,
      tmForm: {
        // 收集表单的对象
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        // require：子段是否必须
        // message：提示信息
        // trigger：用户的行为（blur失焦、change文本变化
        tmName: [
          { required: true, message: "请输入品牌的名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validatetmName, trigger: "change" },
        ],
        // 品牌logo验证规则
        logoUrl: [
          // 无法获取到组件upload的行为，因此不用写
          { required: true, message: "请选择品牌图片" },
          {},
        ],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 分页器两个事件默认传入pager表示选中的页码或者改变后的页码
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改品牌
    updateTradeMark(row) {
      // row 当前用户选中的品牌信息，由服务器返回
      this.dialogFormVisible = true;
      // 将服务器返回的品牌信息直接赋值给tmForm展示，会出现不好的情况
      // 直接赋值会导致tmForm与row指向同一个对象，造成之后修改tmForm会引起row变化
      // 因此为了区分来两个对象，用展开运算符对一层的对象实现深拷贝，将两个对象分开
      this.tmForm = { ...row };
    },
    // 添加按钮 （添加品牌或者修改品牌）
    addOrUpdateTradeMark() {
      // 当全部表单验证通过后，再进行业务逻辑

      this.$refs.ruleForm.validate(async (success) => {
        // 如果ref下的全部通过验证，传入的布尔值为真
        if (success) {
          // 确定按钮的来源可能是添加或者修改，因此从id判断区分
          this.dialogFormVisible = false;
          // 发请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息：添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改之后要刷新,刷新后会调到第一页
            this.getPageList(this.tmForm.id ? (pager = this.page) : 1);
          } else {
            console.log("error submit!!");
            return false;
          }
        }
      });
    },
    // 删除按钮
    deleteTradeMark(row) {
      // 弹框
      // then 用户点击确定按钮触发
      // catch 用户点击取消按钮触发
      this.$confirm(`确定删除${row.tmName}？`, "删除品牌", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 删除后的页面跳转，如果删除后页面空了，要向上一页跳转
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 上传成功后，返回给前端的数据
      // file 上传成功后，返回给前端的信息
      // 两者看着用，一般会用res

      // 收集品牌图片在服务器上的位置
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // handleCurrentChange(pager){
    //   this.page=pager;
    //   this.getPageList();
    // }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
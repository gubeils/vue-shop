<template>
  <div>
    <BreadCrumb :breadcrumb="breadcrumb" />
    <el-card>
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            class="cat_opt"
            v-model="selectedKeys"
            :options="cateList"
            :props="{ ...cateProps, expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环生成tag标签 -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="small"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环生成tag标签 -->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="small"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      ><el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改添加对话框 -->
    <el-dialog
      :title="editTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      ><el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item :label="editTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { BreadCrumb },
  data() {
    return {
      breadcrumb: {
        title: "商品管理",
        subTitle: "参数列表",
      },
      rightsList: [],
      // 商品分类数组
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的商品分类的id
      selectedKeys: [],
      // tab 页签的名称 被激活
      activeName: "many",
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 添加参数对话框的显示状态
      addDialogVisible: false,
      // 添加参数表单
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改参数对话框的显示状态
      editDialogVisible: false,
      // 修改参数表单
      editForm: {
        attr_name: "",
      },
      // 修改参数表单的校验规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisabled() {
      return this.selectedKeys.length != 3 ? true : false;
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1];
      } else {
        return null;
      }
    },
    titleText() {
      return this.activeName === "many" ? "添加动态参数" : "添加静态属性";
    },
    editTitleText() {
      return this.activeName === "many" ? "修改动态参数" : "修改静态属性";
    },
  },
  methods: {
    getCateList() {
      this.axios.get("categories").then(res => {
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data;
          console.log(this.cateList);
        } else {
          this.$message.error("获取商品分类列表失败");
        }
      });
    },
    // tab 页签的点击事件
    handleChange() {
      this.getParamsData();
    },
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    // 获取参数列表
    getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
      console.log(this.selectedKeys);
      this.axios
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            res.data.data.forEach(item => {
              // item.attr_vals = item.attr_vals.split(",");
              item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
              item.inputVisible = false;
              item.inputValue = "";
            });
            console.log("获取参数列表", res.data.data);

            if ((this, this.activeName === "many")) {
              this.manyTableData = res.data.data;
            } else {
              this.onlyTableData = res.data.data;
            }
          } else {
            this.$message.error("获取参数列表失败");
          }
        });
    },
    // 添加参数弹框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.axios
            .post(`categories/${this.cateId}/attributes`, {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            })
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message.success("添加参数成功");
                this.addDialogVisible = false;
                this.getParamsData();
              } else {
                this.$message.error("添加参数失败");
              }
            });
        }
      });
    },
    // 打开修改参数对话框
    showEditDialog(attr_id) {
      // this.$refs.editFormRef.resetFields();
      this.editDialogVisible = true;
      this.axios
        .get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: { attr_sel: this.activeName },
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.editForm = res.data.data;
          } else {
            this.$message.error("获取参数信息失败");
          }
        });
    },
    // // 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.axios
            .put(
              `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
              {
                attr_name: this.editForm.attr_name,
                attr_sel: this.activeName,
              }
            )
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success("修改参数成功");
                this.editDialogVisible = false;
                this.getParamsData();
              } else {
                this.$message.error("修改参数失败");
              }
            });
        }
      });
    },
    // 删除参数
    delParams(attr_id) {
      console.log(111);
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(`categories/${this.cateId}/attributes/${attr_id}`)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success("删除参数成功");
                this.editDialogVisible = false;
                this.getParamsData();
              } else {
                this.$message.error("删除参数失败");
              }
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //  添加动态参数
    handleInputConfirm(row) {
      let inputValue = row.inputValue.trim();
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      row.inputVisible = false;
      row.inputValue = "";
      this.axios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success("修改参数成功");
          } else {
            this.$message.error("修改参数失败");
          }
        });
    },

    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(row, i) {
      row.attr_vals.splice(i, 1);
      this.axios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success("删除参数成功");
          } else {
            this.$message.error("删除参数失败");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 15px 5px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 100px;
  margin: 5px;
}
</style>

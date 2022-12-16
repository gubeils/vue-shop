<template>
  <div>
    <BreadCrumb :breadcrumb="breadcrumb" />

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" style="color: lightgreen" v-else></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="action" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialogVisible(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类表单  -->
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ ...cascaderProps, expandTrigger: 'hover' }"
            @change="parentCateChanged"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editrules"
        ref="editruleForm"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
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
        subTitle: "商品分类",
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [], // 分类列表
      total: 0, // 总条数

      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",

          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "action",
        },
      ],
      addCateDialogVisible: false, // 添加分类对话框是否显示
      editCateDialogVisible: false, // 编辑分类对话框是否显示
      // 添加分类表单
      addCateFrom: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 级联选择器
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [], // 选中的级联选择器的值
      parentCateList: [], // 父级分类列表
      editForm: {
        cat_name: "",
        cat_id: "",
      }, // 编辑分类表单
      editrules: {
        // 编辑分类表单验证规则
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      }, // 编辑分类表单验证规则
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取分类列表
    getCateList() {
      const url = `categories`;
      this.axios.get(url, { params: this.queryInfo }).then(res => {
        console.log("分类列表", res.data.data);
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data.result;
          this.total = res.data.data.total;
        }
      });
    },
    // 分页大小改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 当前页改变时触发
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getCateList();
    },
    // 显示添加分类对话框
    showAddCateDialogVisible() {
      this.getParentCate();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类
    getParentCate() {
      const url = `categories`;
      this.axios.get(url, { params: { type: 2 } }).then(res => {
        console.log("分类列表type2", res.data.data);
        if (res.data.meta.status === 200) {
          // this.cateList = res.data.data.result;
          // this.total = res.data.data.total;
          this.parentCateList = res.data.data;
        }
      });
    },
    // 父级分类改变时触发
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 获取选中的最后一项

      if (this.selectedKeys.length > 0) {
        const lastItem = this.selectedKeys[this.selectedKeys.length - 1];
        // 设置父级分类id
        this.addCateFrom.cat_pid = lastItem;
        // 设置分类级别
        this.addCateFrom.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 设置父级分类id
        this.addCateFrom.cat_pid = 0;
        // 设置分类级别
        this.addCateFrom.cat_level = 0;
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFromRef.validate(valid => {
        if (valid) {
          const url = `categories`;
          this.axios.post(url, this.addCateFrom).then(res => {
            console.log("添加分类", res.data.data);
            if (res.data.meta.status === 201) {
              this.$message({
                type: "success",
                message: "添加分类成功",
              });
              this.addCateDialogVisible = false;
              this.getCateList();
              // this.addCateDialogClose()
            }
          });
        }
      });

      // const url = `categories`;
      // this.axios.post(url,this.addCateFrom).then(res=>{
      //   console.log(res.data);
      //   if(res.data.meta.status === 201){
      //     this.$message({
      //       type: 'success',
      //       message: '添加分类成功'
      //     });
      //     this.addCateDialogVisible = false;
      //     this.getCateList();
      //   }
      // })
      console.log(this.addCateFrom);
    },
    // 添加分类对话框关闭时触发
    addCateDialogClose() {
      this.$refs.addCateFromRef.resetFields();
      this.selectedKeys = [];
      this.addCateFrom.cat_pid = 0;
      this.addCateFrom.cat_level = 0;
    },
    // 显示编辑分类对话框
    showEditCateDialogVisible(row) {
      this.editCateDialogVisible = true;
      this.editForm.cat_name = row.cat_name;
      this.editForm.cat_id = row.cat_id;
      this.axios.get(`categories/${row.cat_id}`).then(res => {
        console.log("编辑分类", res.data.data);
        if (res.data.meta.status === 200) {
          this.selectedKeys = res.data.data.cat_pid;
        }
      });
    },

    // 编辑分类关闭时触发
    editCateDialogClose() {
      this.$refs.editruleForm.resetFields();
    },

    // 编辑分类
    editCate() {
      this.$refs.editruleForm.validate(valid => {
        if (valid) {
          const url = `categories/${this.editForm.cat_id}`;
          this.axios.put(url, this.editForm).then(res => {
            console.log("编辑分类", res.data.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "编辑分类成功",
              });
              this.editCateDialogVisible = false;
              this.getCateList();
              // this.addCateDialogClose()
            }
          });
        }
      });
    },

    // 删除分类
    delCate(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = `categories/${row.cat_id}`;
          this.axios.delete(url).then(res => {
            console.log("删除分类", res.data.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除分类成功",
              });
              this.getCateList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>

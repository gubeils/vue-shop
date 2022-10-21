<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>

        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = !dialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>

        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户弹框 -->
    <Dialog
      :dialogVisible.sync="dialogVisible"
      :addOrEdit.sync="addOrEdit"
      :rowState="rowState"
      :editFrom="editFrom"
    />
  </div>
</template>

<script>
import Dialog from "../components/Dialog.vue";
export default {
  data() {
    return {
      // 获取用户列表的数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 用户列表数据
      userList: [],
      // 总条数
      total: 0,
      // 是否展示编辑用户的对话框
      dialogVisible: false,
      addOrEdit: true,
      rowState: {},
      editFrom: {}, // 编辑用户的表单数据
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      const url = "users";
      this.axios.get(url, { params: this.queryInfo }).then(res => {
        console.log(res.data);
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
          // 清空搜索框
          // this.queryInfo.query = "";
        } else {
          this.$message({
            type: "error",
            message: "获取用户列表失败",
          });
        }
      });
    },
    // 每页显示多少条
    handleSizeChange(newValue) {
      this.queryInfo.pagesize = newValue;
      this.getUserList();
    },
    // 当前页
    handleCurrentChange(newValue) {
      this.queryInfo.pagenum = newValue;
      this.getUserList();
    },
    // 用户状态改变
    userStateChange(state) {
      console.log("用户状态改变", state);
      const uId = state.id;
      const type = state.mg_state;
      const url = `users/${uId}/state/${type}`;
      console.log(url);
      this.axios.put(url).then(res => {
        console.log(res.data);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "修改用户状态成功",
          });
        } else {
          state.mg_state = !state.mg_state;
          this.$message({
            type: "error",
            message: "修改用户状态失败",
          });
        }
      });
    },
    // 点击×清空input搜索
    clearInput() {
      // 清空axios query
      this.queryInfo.query = "";
      // 刷新列表
      this.getUserList();
    },
    // 点击编辑按钮
    editUser(row) {
      this.addOrEdit = false;
      this.rowState = row;

      console.log(row);
      this.dialogVisible = true;
      this.axios.get(`users/${this.rowState.id}`).then(res => {
        // this.addFrom = res.data.data
        console.log("id", res.data);
        this.editFrom = res.data.data;
      });
    },
    // 点击删除按钮
    delUser(id) {
      console.log(id);
        // 气泡框
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`users/${id}`).then(res => {
            console.log(res.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除用户成功!'
              });
              this.getUserList();
            } else {
              this.$message({
                type: 'error',
                message: '删除用户失败!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
  watch: {
    "this.dialogVisible"(newValue, oldValue) {
      console.log("newValue", newValue);
      console.log("oldValue", oldValue);
    },
  },
  components: { Dialog },
};
</script>

<style lang="scss" scoped></style>

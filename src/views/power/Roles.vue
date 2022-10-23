<template>
  <div>
    <!-- 面包屑导航区 -->
    <BreadCrumb :breadcrumb="breadcrumb" />
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border stripe highlight-current-row>
        <!-- 折叠展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  size="medium"
                  closable
                  @close="delAuth(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right" v-if="item1.children != 0"></i>
              </el-col>
              <!-- 渲染二和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delAuth(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i
                      class="el-icon-caret-right"
                      v-if="item2.children != 0"
                    ></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="delAuth(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
            <!-- {{ scope.row }} -->
           </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showeditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showAuthDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRuleForm"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editFrom"
        :rules="addFromRules"
        ref="editFormRef"
        label-width="80px"
        @close="editDialogClosed"
      >
        <el-form-item label="角色名">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹框 -->
    <el-dialog title="分配权限" :visible.sync="authDialogVisible" width="50%" @close="closeAutnDialog">
      <!-- 树形控件 -->

      <el-tree
        :data="authList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotAuth"
          >确 定</el-button
        >
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
      // 面包屑导航
      breadcrumb: {
        title: "权限管理",
        subTitle: "角色列表",
      },
      // 角色列表数据
      rolesList: [],
      // 添加用户弹框
      dialogVisible: false,
      // 编辑用户弹框
      editDialogVisible: false,
      // 分配权限弹框
      authDialogVisible: false,
      // 添加用户表单
      addFrom: {
        roleName: "",
        roleDesc: "",
      },
      // 添加用户表单验证规则
      addFromRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur",
          },
        ],
      },
      // 编辑用户表单数据
      editFrom: {},
      // 分配权限表单数据
      authList: [],
      // 树形控件配置
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的权限
      defaultCheckedKeys: [],
      roleId: ''
    };
  },
  methods: {
    // 获取角色列表数据
    getRolesList() {
      const url = `roles`;
      this.axios.get(url).then(res => {
        console.log("角色列表数据", res.data.data);
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data;
        }
      });
    },
    // 添加弹窗关闭事件
    addDialogClosed() {
      this.$refs.addFromRuleForm.resetFields();
    },
    // 添加角色
    addRole() {
      this.$refs.addFromRuleForm.validate(valid => {
        if (valid) {
          const url = `roles`;
          this.axios.post(url, this.addFrom).then(res => {
            console.log("添加角色", res.data);
            if (res.data.meta.status === 201) {
              this.$message({
                type: "success",
                message: "添加角色成功",
              });
              this.dialogVisible = false;
              this.getRolesList();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 展示修改对话框
    showeditDialog(id) {
      this.editDialogVisible = true;
      console.log("展开修改对话框id", id);
      this.axios.get(`roles/${id}`).then(res => {
        console.log("展开修改对话框", res.data);
        if (res.data.meta.status === 200) {
          this.editFrom = res.data.data;
        } else {
          this.$message({
            type: "error",
            message: "获取角色信息失败",
          });
        }
      });
    },
    // 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 编辑角色
    editRole() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          const url = `roles/${this.editFrom.roleId}`;
          this.axios.put(url, this.editFrom).then(res => {
            console.log("修改角色", res.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "修改角色成功",
              });
              this.editDialogVisible = false;
              this.getRolesList();
            } else {
              this.$message({
                type: "error",
                message: "修改角色失败",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除角色
    delRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete(`roles/${id}`).then(res => {
            console.log("删除角色", res.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除角色成功",
              });
              this.editDialogVisible = false;
              this.getRolesList();
            } else {
              this.$message({
                type: "error",
                message: "删除角色失败",
              });
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
    delAuth(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = `roles/${role.id}/rights/${rightId}`;
          this.axios.delete(url).then(res => {
            console.log("删除权限", res.data);
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除权限成功",
              });

              // this.getRolesList();
              role.children = res.data.data;
            } else {
              this.$message({
                type: "error",
                message: "删除权限失败",
              });
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
    // 展示分配权限对话框
    showAuthDialog(role) {
      this.roleId=role.id;
      this.getLeafKeys(role, this.defaultCheckedKeys);
      this.authDialogVisible = true;
      this.axios.get(`rights/tree`).then(res => {
        console.log("权限列表", res.data);
        if (res.data.meta.status === 200) {
          this.authList = res.data.data;
        }
      });
    },
    // 通过递归获取角色的三级权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    closeAutnDialog() {
      // this.$refs.authFormRef.resetFields();
      this.defaultCheckedKeys = [];
    },
    // 分配权限
    allotAuth() {
      // 
      const keys=[... this.$refs.treeRef.getCheckedKeys(),this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log("keys",keys);
      
      const idStr=keys.join(',')
      const url = `roles/${this.roleId}/rights`;
      this.axios.post(url, { rids: idStr }).then(res => {
        console.log("分配权限", res.data);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "分配权限成功",
          });
          this.authDialogVisible = false;
          this.getRolesList();
        } else {
          this.$message({
            type: "error",
            message: "分配权限失败",
          });
        }
      });
    },
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 20px;
  font-size: 14px;
}
.bdtop {
  border-top: 1px solid #ddd;
}
.bdbottom {
  border-bottom: 1px solid #ddd;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

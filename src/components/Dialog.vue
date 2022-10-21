<template>
  <!-- 添加用户弹框 -->

  <el-dialog
    :title="addOrEdit ? '添加用户' : '修改用户'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
    @closed="closedDialog"
  >
    <!-- 添加用户表单-->
    <el-form
      :model="editFrom"
      :rules="rulesAddFrom"
      ref="ruleFormAddFrom"
      label-width="70px"
    >
      <!-- :disabled="{ addOrEdit: true }" -->
      <el-form-item label="用户名" prop="username">
        <el-input :disabled="!addOrEdit" v-model="editFrom.username"></el-input>
      </el-form-item>
      <el-form-item v-if="addOrEdit" label="密码" prop="password">
        <el-input v-model="editFrom.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editFrom.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- $emit('update:dialogVisible', false) -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>

      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    addOrEdit: {
      type: Boolean,
    },
    rowState: {},
    editFrom: {},
  },
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("输入的邮箱不符合要求，请重新输入！"));
    };
    // 验证手机的规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("输入的手机格式不正确，请重新输入！"));
    };

    return {
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, // 添加用户表单的临时数据对象
      rulesAddFrom: {
        username: [
          {
            required: true,
            message: "请输入用户名!",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            validator: checkMobile,
          },
          ,
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
          },
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // x按钮
    handleClose() {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.$emit("update:dialogVisible", false);
          this.$emit("update:addOrEdit", true);
          done();
        })
        .catch(_ => {});
    },
    cancle() {
      this.$emit("update:dialogVisible", false);
      if (!this.addOrEdit) {
        this.$emit("update:addOrEdit", true);
      }
    },

    // 添加用户
    addUser() {
      console.log("id", this.rowState.id);
      // 添加
      if (this.addOrEdit) {
        this.$emit("update:addOrEdit", false);
        this.$refs.ruleFormAddFrom.validate(valid => {
          if (valid) {
            const url = "users";
            const params = this.editFrom;
            this.axios.post(url, params).then(res => {
              console.log(res.data);
              if (res.data.meta.status === 201) {
                this.$message({
                  type: "success",
                  message: "添加用户成功！",
                });
                this.$emit("update:dialogVisible", false);

                // this.$emit("addUser");
                this.$parent.getUserList();
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "添加用户失败！",
            });
            return false;
          }
        });
      } else {
    
        // 编辑
        this.$refs.ruleFormAddFrom.validate(valid => {
          //   this.addFrom.username = this.editFrom.username;
          // this.addFrom.email = this.editFrom.email;
          // this.addFrom.mobile = this.editFrom.mobile;
          if (valid) {
            const url = `users/${this.rowState.id}`;
            const params = `email=${this.editFrom.email}&mobile=${this.editFrom.mobile}`;
            this.axios.put(url, params).then(res => {
              console.log(res.data);
              if (res.data.meta.status === 200) {
                this.$message({
                  type: "success",
                  message: "修改用户成功！",
                });
                this.$emit("update:dialogVisible", false);
                this.$emit("update:addOrEdit", true);

                // this.$emit("addUser");
                this.$parent.getUserList();
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "修改用户失败！",
            });
            return false;
          }
        });
      }
    },
    // 关闭弹框
    closedDialog() {
      // 清空临时数据对象
      this.$refs.ruleFormAddFrom.resetFields();
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped></style>

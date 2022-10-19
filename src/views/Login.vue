<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="70px"
        class="login_from"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            prefix-icon="iconfont icon-jurassic_user"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-mima1"
            v-model="form.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="reastFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    reastFrom() {
      console.log(this);
      this.$refs.form.resetFields();
    },
    login() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const url = "login";
        const params =
          "username=" + this.form.name + "&password=" + this.form.password;
        this.axios.post(url, params).then(res => {
          console.log(res.data);
          if (res.data.meta.status === 200) {
            this.$message({
              type: "success",
              message: "登陆成功",
            });
            window.sessionStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: "登陆失败",
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    // margin: 0 auto;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;

      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 80%;
  // margin: auto;
  margin-left: 50px;
  // overflow: hidden;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

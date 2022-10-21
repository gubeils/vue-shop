<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>电商台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="this.isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <AsideView ref="aside_son" :isCollapse="isCollapse" />
      </el-aside>
      <!-- 主内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideView from "@/components/AsideView.vue";
export default {
  components: { AsideView },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    loginOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 切换侧边栏的展开和收起
    toggleCollpase() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition: all 0.25s;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  width: 100%;
  text-align: center;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.1em;
  user-select: none;
}
</style>

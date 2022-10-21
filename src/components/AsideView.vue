<template>
  <el-menu
    :default-active="$route.path"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409eff"
    unique-opened
    :collapse="isCollapse"
    :collapse-transition="false"
    router
  >
    <!-- 一级菜单 -->
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <!-- 图标 -->
        <i class="menu-icon" :class="icons[item.id]"></i>
        <!-- 文本 -->
        <span>{{ item.authName }}</span>
      </template>
      <!-- 二级菜单 -->
      <!--  -->
      <el-menu-item
        :index="item2.path"
        v-for="item2 in item.children"
        :key="item2.id"
      >
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{ item2.authName }}</span>
        </template></el-menu-item
      >
    </el-submenu>
  </el-menu>
</template>

<script>
// import { truncate } from 'fs/promises';

export default {
  props: ["isCollapse"], //接收父组件传递过来的数据
  data() {
    return {
      menuList: [],
      icons: {
        125: "iconfont icon-yonghuguanli",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },
    };
  },
  methods: {
    getMenulist() {
      const url = "menus";
      this.axios.get(url).then(res => {
        console.log(res.data);
        if (res.data.meta.status === 200) {
          this.menuList = res.data.data;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
          });
        }
      });
    },
  },
  mounted() {
    this.getMenulist();
  },
  watch: {
    isCollapse(newVal) {
      console.log(newVal);
    },
    $router(newVal) {},
  },
};
</script>

<style lang="scss" scoped>
.el-menu {
  user-select: none;
}
.menu-icon {
  font-size: 20px;
  margin-right: 10px;
}
</style>

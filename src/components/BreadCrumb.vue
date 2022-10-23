<template>
  
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumb.title}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumb.subTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<script>
export default {
  props:['breadcrumb']
};
</script>

<style lang="scss" scoped></style>

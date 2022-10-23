<template>
  <div>
    <!-- 面包屑导航区 -->
    <BreadCrumb :breadcrumb="breadcrumb" />

    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe highlight-current-row>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { BreadCrumb },
  data() {
    return {
      breadcrumb: {
        title: "权限管理",
        subTitle: "权限列表",
      },
      rightsList: [],
    };
  },
  methods: {
    getRightsList() {
      const url = `rights/list`;
      this.axios.get(url).then(res => {
        console.log('权限列表',res.data.data);
        if (res.data.meta.status === 200) {
          this.rightsList = res.data.data;
        }
      });
    },
  },
  created() {
    this.getRightsList();
  },
};
</script>

<style lang="scss" scoped></style>

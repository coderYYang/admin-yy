<template>
  <div class='rights'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data='rightsList' border stripe>
        <el-table-column type='index' align='center'></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级' prop='level'>
          <template #default='scope'>
            <el-tag v-if='scope.row.level == "0"'>一级</el-tag>
            <el-tag v-if='scope.row.level == "1"' type='success'>二级</el-tag>
            <el-tag v-if='scope.row.level == "2"' type='warning'>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Rights } from '@/api/api'

export default {
  name: 'Rights',
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRights();
  },
  methods: {
    // 获取表格数据
    getRights() {
      let list = 'list';
      Rights(list).then(res => {
        if (res.data.meta.status === 200) {
          this.rightsList = res.data.data;
        } else {
          ElMessage.error(res.data.meta.msg);
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

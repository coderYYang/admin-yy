<template>
  <div class="welcome">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>欢迎来到Admin-Yy</h3>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Welcome"
}
</script>

<style scoped>

</style>

<template>
  <el-container class='home-container'>
    <el-header>
      <div>
        <img src='../assets/image/bareheaded.jpg' alt='logo' style='width: 61px; height: 56px; border-radius: 50%;'
             draggable='false'>
        <span>电商后台管理系统</span>
      </div>
      <div>
        <span style='margin-right: 5px'>您好：{{ username }}</span>
        <el-button type='info' @click='logout' size='mini'>退出</el-button>
      </div>
    </el-header>
    <el-container class='main-container'>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class='toggle-button' @click='toggleCollapse'>|||</div>
        <el-menu background-color='#333744' text-color='#fff' active-text-color='#409eff' :unique-opened='true'
                 :collapse='isCollapse' :collapse-transition='false' :router='true' :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id + ''" v-for='(item, index) in menuList' :key='item.id'>
            <!-- 一级菜单模板区 -->
            <template #title>
              <!-- 图标 -->
              <i :class='iconsList[item.id]'></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for='(subItem, index) in item.children' :key='subItem.id'
                          @click="saveNavState('/' + subItem.path)">
              <template #title>
                <!-- 图标 -->
                <i class='el-icon-menu'></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main :style='{width: isCollapse ? "calc(100% - 64px)" : "calc(100% - 200px)"}'>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Menu } from '@/api/api'

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsList: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      // 是否折叠
      isCollapse: false,
      // 保存当前路由路径
      activePath: '',
      username: ''
    }
  },
  created() {
    this.getMenu()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.username = window.sessionStorage.getItem('username')
  },
  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    getMenu() {
      Menu().then(res => {
        if (res.status === 200 && res.data.meta.status === 200) {
          this.menuList = res.data.data
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error'
          })
        }
      })
    },
    // 左侧菜单栏折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前路由路径
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}

.el-header {
  height: 60px;
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.main-container {
  height: calc(100% - 60px);
}

.el-aside {
  height: 100%;
  background: #333744;

  .el-menu {
    border-right: none;
  }

  .toggle-button {
    background: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background: #eaedf1;
  height: 100%;
  overflow: auto;
}

.iconfont {
  margin-right: 10px;
}
</style>

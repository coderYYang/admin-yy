<template>
  <div class='users'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入' v-model='queryInfo.query' clearable @clear='getUser' size='mini'>
            <template #append>
              <el-button icon='el-icon-search' @click='getUser' size='mini'></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='addDialog = true' size='mini'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data='userList' style='width: 100%' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='状态' align='center'>
          <template #default='scope'>
            <el-switch v-model='scope.row.mg_state' active-color='#13ce66' inactive-color='#ff4949'
                       @change='getUserState(scope.row)' />
          </template>
        </el-table-column>
        <el-table-column label='操作' width='300px' align='center'>
          <template #default='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row)'>编辑</el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteUser(scope.row)'>删除</el-button>
            <el-button type='warning' icon='el-icon-setting' size='mini' @click='setRole(scope.row)'>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-config-provider :locale='locale'>
        <el-pagination v-model:currentPage='queryInfo.pagenum' :page-sizes='[5, 10, 15, 20]'
                       :page-size='queryInfo.pagesize'
                       layout='total, sizes, prev, pager, next, jumper' :total='total' @size-change='handleSizeChange'
                       @current-change='handleCurrentChange'>
        </el-pagination>
      </el-config-provider>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog v-model='addDialog' title='添加用户' width='50%' @close='addDialogClose'>
      <el-form ref='ruleFormRef' :model='addForm' :rules='addFormRules' label-width='70px'>
        <el-form-item label='用户名' prop='username'>
          <el-input v-model='addForm.username'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addForm.password'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='addForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='addDialog = false' size='mini'>取 消</el-button>
        <el-button type='primary' @click='addUser' size='mini'>确 定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 修改用户Dialog -->
    <el-dialog v-model='editDialog' title='修改用户' width='50%' @close='editDialogClose'>
      <el-form ref='editFormRef' :model='editForm' :rules='editFormRules' label-width='70px'>
        <el-form-item label='用户名'>
          <el-input v-model='editForm.username' disabled></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='editForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机号' prop='mobile'>
          <el-input v-model='editForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取 消</el-button>
        <el-button type='primary' @click='editUser' size='mini'>确 定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog v-model='setDialog' title='分配角色' width='50%' @close='setClose'>
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model='selectedRoleId' placeholder='请选择'>
            <el-option v-for='item in rolesList' :key='item.id' :label='item.roleName' :value='item.id'></el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='setDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='saveRoleInfo' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Users, UserStatus, AddUser, UserDetail, EditUser, DeleteUser, Roles, SetUserRole } from '@/api/api'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'Users',
  data() {
    // 验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 验证手机号规则
    const checkMobile = (rule, value, callback) => {
      // 验证手机号正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      addDialog: false,
      editDialog: false,
      setDialog: false,
      // 添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度为3-10字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度为6-15字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户验证
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户
      editForm: {},
      // 分配权限
      userInfo: {},
      rolesList: [],
      selectedRoleId: '',
      locale: zhCn
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    // 获取用户信息
    getUser() {
      Users(this.queryInfo).then(res => {
        if (res.status === 200 && res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        } else {
          ElMessage({
            message: res.data.meta.msg
          })
        }
      })
    },
    // 监听一页显示多少条数据
    handleSizeChange(value) {
      this.queryInfo.pagesize = value
      this.queryInfo.pagenum = 1
      this.getUser()
    },
    // 监听页码值变换
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value
      this.getUser()
    },
    // 监听用户开关状态
    getUserState(userInfo) {
      let data = {
        uId: userInfo.id,
        type: userInfo.mg_state
      }
      UserStatus(data).then(res => {
        if (res.data.meta.status === 200) {
          ElMessage.success(res.data.meta.msg)
          this.getUser()
        } else {
          userInfo.mg_srate = !userInfo.mg_srate
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 监听添加用户框关闭重置表单
    addDialogClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 添加用户必填验证
    addUser() {
      this.$refs.ruleFormRef.validate(val => {
        if (val) {
          AddUser(this.addForm).then(res => {
            if (res.data.meta.status === 201) {
              ElMessage.success(res.data.meta.msg)
              this.addDialog = false
              this.getUser()
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 展示修改用户信息
    showEdit(edit) {
      UserDetail(edit.id).then(res => {
        this.editDialog = true
        if (res.data.meta.status === 200) {
          this.editForm = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 修改用户弹框重置事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(val => {
        if (val) {
          let obj = {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
          EditUser(this.editForm.id, obj).then(res => {
            if (res.data.meta.status === 200) {
              this.editDialog = false
              this.getUser()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 删除用户
    deleteUser(remove) {
      ElMessageBox.confirm(
        '删除用户?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          DeleteUser(remove.id).then(res => {
            if (res.data.meta.status === 200) {
              this.getUser()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // 分配角色
    setRole(userInfo) {
      this.userInfo = userInfo
      // 获取角色列表
      Roles().then(res => {
        this.setDialog = true
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 分配角色确定
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        ElMessage.warning('请选择要分配的角色!')
        return
      }
      let data = {
        rid: this.selectedRoleId
      }
      SetUserRole(this.userInfo.id, data).then(res => {
        this.setDialog = false
        if (res.data.meta.status === 200) {
          ElMessage.success(res.data.meta.msg)
          this.getUser()
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 分配角色 dialog 关闭事件
    setClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <div class='roles'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' size='mini'>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data='rolesList' border stripe>
        <!-- 展开列 -->
        <el-table-column type='expand'>
          <template #default='scope'>
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '']" v-for='(item1, index1) in scope.row.children'
                    :key='item1.id'>
              <!-- 一级权限 -->
              <el-col :span='5'>
                <el-tag closable @close='removeRightById(scope.row, item1)'>{{ item1.authName }}</el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span='19'>
                <el-row :class="[index2 === 0 ? '' : 'bdtop']" v-for='(item2, index2) in item1.children'
                        :key='item2.id'>
                  <el-col :span='6'>
                    <el-tag closable type='success' @close='removeRightById(scope.row, item2)'>{{ item2.authName }}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag closable type='warning' @close='removeRightById(scope.row, item3)'
                            v-for='item3 in item2.children' :key='item3.id'>{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index' align='center'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='300px' align='center'>
          <template #default='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row)'>编辑</el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='showDelete(scope.row.id)'>删除</el-button>
            <el-button type='warning' icon='el-icon-setting' size='mini' @click='showSetRight(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑 -->
    <el-dialog v-model='editDialog' title='编辑角色' width='50%' @close='$refs.editRef.resetFields()'>
      <el-form ref='editRef' :model='editFrom' :rules='editRules' label-width='100px'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='editFrom.roleName'></el-input>
        </el-form-item>
        <el-form-item label='角色描述'>
          <el-input v-model='editFrom.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='editConfirm' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog v-model='setRightDialog' title='分配权限' width='50%' @close='setRightClose'>
      <el-tree ref='treeRef' :data='rightsList' :props='rightsProps' node-key='id' show-checkbox default-expand-all
               :default-checked-keys='defKeys' />
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='setRightDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='allotRights' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Roles, DeleteRoles, Rights, SetRoles, GetRoles, EditRoles, RolesDeleteUser, DeleteUser } from '@/api/api'

export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      setRightDialog: false,
      rightsList: [], // 分配权限数据
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 权限分配树默认选中的节点数组
      defKeys: [],
      roleId: '',
      editFrom: {
        roleDesc: '',
        roleId: null,
        roleName: ''
      },
      editRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      editDialog: false
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 获取角色列表数据
    getRoles() {
      Roles().then(res => {
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 展开 tag 删除角色指定权限
    removeRightById(roles, rights) {
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
          let params = {
            roleId: roles.id,
            rightId: rights.id
          }
          DeleteRoles(params).then(res => {
            if (res.data.meta.status === 200) {
              roles.children = res.data.data
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // 分配权限
    showSetRight(role) {
      this.roleId = role.id
      let type = 'tree'
      Rights(type).then(res => {
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialog = true
        if (res.data.meta.status === 200) {
          this.rightsList = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 通过递归形式，获取角色所有三级权限 id，并保存到 defKeys
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(val => this.getLeafKeys(val, arr))
    },
    // 关闭 dialog 清空 defKeys
    setRightClose() {
      this.defKeys = []
    },
    // 编辑
    showEdit(row) {
      GetRoles(row.id).then(res => {
        if (res.data.meta.status === 200) {
          this.editDialog = true
          this.editFrom = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 编辑确定
    editConfirm() {
      this.$refs.editRef.validate(val => {
        if (val) {
          EditRoles(this.editFrom).then(res => {
            this.editDialog = false
            if (res.data.meta.status === 200) {
              ElMessage.success(res.data.meta.msg)
              this.getRoles()
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 删除用户
    showDelete(deleteId) {
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
          RolesDeleteUser(deleteId).then(res => {
            if (res.data.meta.status === 200) {
              ElMessage.success(res.data.meta.msg)
              this.getRoles()
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // 分配权限 dialog 确定
    allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      let params = {
        rids: idStr
      }
      SetRoles(this.roleId, params).then(res => {
        this.setRightDialog = false
        if (res.data.meta.status === 200) {
          this.getRoles()
          ElMessage.success(res.data.meta.msg)
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px 20px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

/* dialog 滚动条 */
/deep/ .el-overlay-dialog {
  height: 100%;
  overflow: hidden !important;
}

/deep/ .el-dialog {
  height: 70%;
}

/deep/ .el-dialog__body {
  height: calc(100% - 54px - 16vh - 10px);
  overflow-y: auto;
}
</style>

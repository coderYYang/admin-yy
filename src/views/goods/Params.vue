<template>
  <div class='params'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title='注意：只允许为第三级分类设置相关参数！' type='warning' show-icon :closable='false'></el-alert>
      <el-row style='margin: 15px 0;'>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader :options='cateList' :props='cateProps' v-model='cateKeys' @change='cateChange'
                       placeholder='请选择' size='mini'></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model='activeName' @tab-click='handleClick'>
        <el-tab-pane label='动态参数' name='many'>
          <el-button type='primary' size='mini' :disabled='cateKeys.length !== 3' @click='addDialog = true'>添加参数
          </el-button>
          <el-table :data='manyData' border stripe>
            <el-table-column type='expand'>
              <template #default='scope'>
                <el-tag v-for='(item, index) in scope.row.attr_vals' :key='index' closable
                        @close='handleClose(index, scope.row)'>{{ item }}
                </el-tag>
                <!--  <el-input v-if='scope.row.inputVisible' ref='InputRef' v-model='scope.row.inputValue'
                              class='input-new-tag' size='small' @keyup.enter.native='handleInputConfirm(scope.row)'
                              @blur='handleInputConfirm(scope.row)'></el-input>
                      <el-button v-else class='button-new-tag' size='small' @click='showInput(scope.row)'>+ New Tag
                      </el-button> -->
              </template>
            </el-table-column>
            <el-table-column type='index' align='center'></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作' width='300px' align='center'>
              <template #default='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row.attr_id)'>编辑
                </el-button>
                <el-button type='danger' icon='el-icon-delete' size='mini' @click='editDelete(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label='静态属性' name='only'>
          <el-button type='primary' size='mini' :disabled='cateKeys.length !== 3' @click='addDialog = true'>添加属性
          </el-button>
          <el-table :data='onlyData' border stripe>
            <el-table-column type='expand'></el-table-column>
            <el-table-column type='index' align='center'></el-table-column>
            <el-table-column label='属性名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作' width='300px' align='center'>
              <template #default='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row.attr_id)'>编辑
                </el-button>
                <el-button type='danger' icon='el-icon-delete' size='mini' @click='editDelete(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 -->
    <el-dialog v-model='addDialog' :title="this.activeName == 'many' ? '添加动态参数' : '添加静态属性'" width='50%'
               @close='addClose'>
      <el-form ref='addRef' :model='addForm' :rules='addRules' label-width='100px'>
        <el-form-item :label="this.activeName == 'many' ? '动态参数' : '静态属性'" prop='attr_name'>
          <el-input v-model='addForm.attr_name' placeholder='请输入'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='addDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='addParams' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog v-model='editDialog' :title="this.activeName == 'many' ? '修改动态参数' : '修改静态属性'" width='50%'
               @close='editClose'>
      <el-form ref='editRef' :model='editForm' :rules='editRules' label-width='100px'>
        <el-form-item :label="this.activeName == 'many' ? '动态参数' : '静态属性'" prop='attr_name'>
          <el-input v-model='editForm.attr_name' placeholder='请输入'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='editParams' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Category, CategoryList, AddParams, SearchEdit, PutEdit, DeleteCategory, SaveAttrVals } from '@/api/api'

export default {
  name: 'Params',
  data() {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      cateKeys: [],
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addDialog: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editDialog: false,
      editForm: {
        attr_name: ''
      },
      editRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 拿到获取参数列表数据的 Id
    cateId() {
      if (this.cateKeys.length === 3) {
        return this.cateKeys[2]
      }
      return null
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    // 选择商品分类数据
    getCategory() {
      Category().then(res => {
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 获取参数列表数据
    getParamsData() {
      if (this.cateKeys.length !== 3) {
        this.cateKeys = [];
        this.manyData = [];
        this.onlyData = [];
        return
      }
      let params = {
        sel: this.activeName
      }
      CategoryList(this.cateId, params).then(res => {
        if (res.data.meta.status === 200) {
          res.data.data.forEach(val => {
            val.attr_vals = val.attr_vals ? val.attr_vals = val.attr_vals.split(' ') : []
            // 控制文本框显示与隐藏
            val.inputVisible = false
            // 文本框输入的值
            val.inputValue = ''
          })
          if (this.activeName == 'many') {
            this.manyData = res.data.data
          } else {
            this.onlyData = res.data.data
          }
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 选择商品分类事件
    cateChange() {
      this.getParamsData()
    },
    // tabs 事件
    handleClick() {
      this.getParamsData()
    },
    // 添加对话框关闭事件
    addClose() {
      this.$refs.addRef.resetFields()
    },
    // 添加参数对话框确定按钮
    addParams() {
      this.$refs.addRef.validate(val => {
        if (val) {
          let data = {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
          AddParams(this.cateId, data).then(res => {
            this.addDialog = false
            if (res.data.meta.status === 201) {
              this.getParamsData()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 编辑
    showEdit(attrId) {
      this.editDialog = true
      SearchEdit(this.cateId, attrId, { attr_sel: this.activeName }).then(res => {
        if (res.data.meta.status === 200) {
          this.editForm = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 编辑对话框关闭事件
    editClose() {
      this.$refs.editRef.resetFields()
    },
    // 编辑确定事件
    editParams() {
      this.$refs.editRef.validate(val => {
        if (val) {
          let data = {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel
          }
          PutEdit(this.cateId, this.editForm.attr_id, data).then(res => {
            this.editDialog = false
            if (res.data.meta.status === 200) {
              this.getParamsData()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 删除
    editDelete(attrId) {
      let params = {
        id: this.cateId,
        attrId: attrId
      }
      ElMessageBox.confirm(
        '删除参数?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          DeleteCategory(params).then(res => {
            if (res.data.meta.status === 200) {
              this.getParamsData()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // New Tag 事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      console.log(row)
      row.inputVisible = true
    },
    // 删除 tag
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      let params = {
        id: this.cateId,
        attrId: row.attr_id
      }
      let data = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      SaveAttrVals(params, data).then(res => {
        if (res.data.meta.status === 200) {
          this.getParamsData();
          ElMessage.success(res.data.meta.msg);
        } else {
          ElMessage.error(res.data.meta.msg);
        }
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
.el-tag, .button-new-tag, .input-new-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>

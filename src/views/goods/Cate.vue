<template>
  <div class='cate'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' size='mini' @click='showAddCate'>添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data='categoryList' border row-key='cat_id' :tree-props='{ children: "children"}' :indent='20'>
        <el-table-column label='分类名称' prop='cat_name'></el-table-column>
        <el-table-column label='是否有效'>
          <template #default='scope'>
            <i :class='scope.row.cat_deleted ? "el-icon-success" : "el-icon-error"'
               :style='{color: scope.row.cat_deleted ? "lightgreen" : "red"}'></i>
          </template>
        </el-table-column>
        <el-table-column label='排序'>
          <template #default='scope'>
            <el-tag v-if='scope.row.cat_level === 0' size='mini'>一级</el-tag>
            <el-tag v-if='scope.row.cat_level === 1' type='success' size='mini'>二级</el-tag>
            <el-tag v-if='scope.row.cat_level === 2' type='warning' size='mini'>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='300px' align='center'>
          <template #default='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row)'>编辑</el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='showDelete(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-config-provider :locale='locale'>
        <el-pagination v-model:currentPage='info.pagenum' :page-sizes='[5, 10, 15, 20]'
                       :page-size='info.pagesize' layout='total, sizes, prev, pager, next, jumper'
                       :total='total' @size-change='handleSizeChange' @current-change='handleCurrentChange'>
        </el-pagination>
      </el-config-provider>
    </el-card>
    <!-- 编辑 -->
    <el-dialog v-model='editDialog' title='编辑名称' width='50%' @close='$refs.editRef.resetFields()'>
      <el-form ref='editRef' :model='editForm' :rules='editRules' label-width='100px'>
        <el-form-item label='分类名称：' prop='cat_name'>
          <el-input v-model='editForm.cat_name' placeholder='请输入'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='editConfirm' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 添加分类 dialog -->
    <el-dialog v-model='addCateDialog' title='添加分类' width='50%' @close='addCateClose'>
      <el-form ref='addCateRef' :model='addCateForm' :rules='addCateRules' label-width='100px'>
        <el-form-item label='分类名称：' prop='cat_name'>
          <el-input v-model='addCateForm.cat_name' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item label='父级分类：'>
          <el-cascader v-model='selectedKeys' :options='fatherCate' :props='fatherProps'
                       @change='handleChange'></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='addCateDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='addCateConfirm' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Category, AddCategory, GetIdCate, EditSubmit, DeleteIdCate, RolesDeleteUser } from '@/api/api'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'Cate',
  data() {
    return {
      categoryList: [],
      info: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      locale: zhCn,
      addCateDialog: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      fatherCate: [],
      fatherProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: [],
      editForm: {
        cat_id: null,
        cat_name: ''
      },
      editRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      editDialog: false
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    // 获取商品分类
    getCategory() {
      Category(this.info).then(res => {
        if (res.data.meta.status === 200) {
          this.categoryList = res.data.data.result
          this.total = res.data.data.total
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 获取父级分类数据
    getFatherCategory() {
      let params = {
        type: 2
      }
      Category(params).then(res => {
        if (res.data.meta.status === 200) {
          this.fatherCate = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 级联选择器事件
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 展示添加分类
    showAddCate() {
      this.addCateDialog = true
      this.getFatherCategory()
    },
    // 添加分类 dialog 关闭事件
    addCateClose() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示添加分类确定按钮
    addCateConfirm() {
      AddCategory(this.addCateForm).then(res => {
        this.addCateDialog = false
        if (res.data.meta.status === 201) {
          ElMessage.success(res.data.meta.msg)
          console.log(res)
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 展示编辑
    showEdit(row) {
      GetIdCate(row.cat_id).then(res => {
        this.editDialog = true
        if (res.data.meta.status === 200) {
          this.editForm = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 编辑确定
    editConfirm() {
      this.$refs.editRef.validate(val => {
        if (val) {
          EditSubmit(this.editForm).then(res => {
            this.editDialog = false
            if (res.data.meta.status === 200) {
              ElMessage.success(res.data.meta.msg)
              this.getCategory()
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 删除分类
    showDelete(row) {
      ElMessageBox.confirm(
        '删除分类?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          DeleteIdCate(row.cat_id).then(res => {
            if (res.data.meta.status === 200) {
              ElMessage.success(res.data.meta.msg)
              this.getCategory()
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // 每页数据改变
    handleSizeChange(val) {
      this.info.pagesize = val
      this.info.pagenum = 1
      this.getCategory()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.info.pagenum = val
      this.getCategory()
    }
  }
}
</script>

<style scoped>
/deep/ .el-cascader {
  width: 100%;
}
</style>

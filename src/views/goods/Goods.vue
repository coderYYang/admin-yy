<template>
  <div class='goods'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入' clearable size='mini' v-model='goodsInfo.query' @clear='getGoodsList'>
            <template #append>
              <el-button icon='el-icon-search' size='mini' @click='getGoodsList'></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' size='mini' @click='$router.push("/goods/add")'>添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data='goodsList' border stripe>
        <el-table-column type='index' align='center'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格(元)' prop='goods_price' width='120px'></el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width='80px'></el-table-column>
        <el-table-column label='创建时间' width='140px'>
          <template #default='scope'>
            {{ getTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='300px' align='center'>
          <template #default='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='showEdit(scope.row)'>编辑</el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini'
                       @click='goodsDelete(scope.row.goods_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-config-provider :locale='locale'>
        <el-pagination v-model:currentPage='goodsInfo.pagenum' :page-sizes='[10, 20, 30, 40]'
                       :page-size='goodsInfo.pagesize' layout='total, sizes, prev, pager, next, jumper'
                       :total='total' @size-change='handleSizeChange' @current-change='handleCurrentChange'>
        </el-pagination>
      </el-config-provider>
    </el-card>
    <!-- 编辑 -->
    <el-dialog v-model='editDialog' title='编辑角色' width='50%' @close='$refs.editRef.resetFields()'>
      <el-form ref='editRef' :model='editForm' :rules='editRules' label-width='100px'>
        <el-form-item label='商品名称' prop='goods_name'>
          <el-input v-model='editForm.goods_name'></el-input>
        </el-form-item>
        <el-form-item label='商品价格' prop='goods_price'>
          <el-input v-model='editForm.goods_price'></el-input>
        </el-form-item>
        <el-form-item label='商品重量' prop='goods_weight'>
          <el-input v-model='editForm.goods_weight'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='editConfirm' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { GetGoods, GoodsDelete, GetIdGoods, EditGoods } from '@/api/api'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'Goods',
  data() {
    return {
      goodsList: [],
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      locale: zhCn,
      editDialog: false,
      editForm: {
        goods_id: null,
        goods_name: '',
        goods_price: '',
        goods_weight: ''
      },
      editRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品信息
    getGoodsList() {
      GetGoods(this.goodsInfo).then(res => {
        if (res.data.meta.status === 200) {
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 编辑
    showEdit(row) {
      GetIdGoods(row.goods_id).then(res => {
        this.editDialog = true;
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
          EditGoods(this.editForm).then(res => {
            this.editDialog = false;
            if (res.data.meta.status === 200) {
              ElMessage.success(res.data.meta.msg);
              this.getGoodsList();
            } else {
              ElMessage.error(res.data.meta.msg);
            }
          })
        }
      })
    },
    // 删除
    goodsDelete(goods_id) {
      ElMessageBox.confirm(
        '删除商品？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          GoodsDelete(goods_id).then(res => {
            if (res.data.meta.status === 200) {
              this.goodsInfo.pagenum = 1
              this.getGoodsList()
              ElMessage.success(res.data.meta.msg)
            } else {
              ElMessage.error(res.data.meta.msg)
            }
          })
        })
        .catch(err => err)
    },
    // 每页显示个数
    handleSizeChange(val) {
      this.goodsInfo.pagesize = val
      this.goodsInfo.pagenum = 1
      this.getGoodsList()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.goodsInfo.pagenum = val
      this.getGoodsList()
    },
    // 时间截取
    getTime(time) {
      if (time) {
        const t = new Date(time)
        const y = t.getFullYear()
        const m = (t.getMonth() + '').padStart(2, '0')
        const d = (t.getDate() + '').padStart(2, '0')
        // const h = (t.getHours() + '').padStart(2, '0');
        // const mm = (t.getMinutes() + '').padStart(2, '0');
        // const s = (t.getSeconds() + '').padStart(2, '0');
        // time = y + '-' + m + '-' + d + '-' + h + '-' + mm + '-' + s;
        time = y + '-' + m + '-' + d
        return time
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>

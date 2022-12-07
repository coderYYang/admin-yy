<template>
  <div class='order'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder='请输入' clearable size='mini' v-model='orderInfo.query' @clear='getOrderList'>
            <template #append>
              <el-button icon='el-icon-search' size='mini' @click='getOrderList'></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data='orderList' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='订单编号' prop='order_number'></el-table-column>
        <el-table-column label='订单价格' prop='order_price'></el-table-column>
        <el-table-column label='是否付款'>
          <template #default='scope'>
            <el-tag v-if='scope.row.pay_status == "1"' type='success'>已付款</el-tag>
            <el-tag v-if='scope.row.pay_status == "0"' type='danger'>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='是否发货' prop='is_send'></el-table-column>
        <el-table-column label='下单时间'>
          <template #default='scope'>
            {{ getTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='300px' align='center'>
          <template #default='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='editDialog = true'>编辑</el-button>
            <el-button type='success' icon='el-icon-location' size='mini' @click='getCourier'>查询物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-config-provider :locale='locale'>
        <el-pagination v-model:currentPage='orderInfo.pagenum' :page-sizes='[10, 20, 30, 40]'
                       :page-size='orderInfo.pagesize' layout='total, sizes, prev, pager, next, jumper'
                       :total='total' @size-change='handleSizeChange' @current-change='handleCurrentChange'>
        </el-pagination>
      </el-config-provider>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog v-model='editDialog' title='修改地址' width='50%' @close='$refs.editRef.resetFields()'>
      <el-form ref='editRef' :model='editForm' :rules='editRules' label-width='100px'>
        <el-form-item label='省市区/县' prop='address1'>
          <el-cascader :options='cityData' v-model='editForm.address1'></el-cascader>
        </el-form-item>
        <el-form-item label='详细地址' prop='address2'>
          <el-input v-model='editForm.address2'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class='dialog-footer'>
        <el-button @click='editDialog = false' size='mini'>取消</el-button>
        <el-button type='primary' @click='editDialog = false' size='mini'>确定</el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 显示物流进度信息 -->
    <el-dialog v-model="courierDialog" title="物流进度" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in courierData" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { OrderList, LookCourier } from '@/api/api'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import cityData from './cityData'

export default {
  name: 'Order',
  data() {
    return {
      orderInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      locale: zhCn,
      editDialog: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData: cityData,
      courierDialog: false,
      courierData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    getOrderList() {
      OrderList(this.orderInfo).then(res => {
        if (res.data.meta.status === 200) {
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 获取物流进度信息
    getCourier() {
      this.courierDialog = true;
      LookCourier().then(res => {
        if (res.data.meta.status === 200) {
          this.courierData = res.data.data;
          ElMessage.success(res.data.meta.message);
        } else {
          ElMessage.error(res.data.meta.message)
        }
      })
    },
    // 每页条数该改变
    handleSizeChange(val) {
      this.orderInfo.pagesize = val
      this.orderInfo.pagenum = 1
      this.getOrderList()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.orderInfo.pagenum = val
      this.getOrderList()
    },
    // 时间截取
    getTime(time) {
      if (time) {
        const t = new Date(time)
        const y = t.getFullYear()
        const m = (t.getMonth() + '').padStart(2, '0')
        const d = (t.getDate() + '').padStart(2, '0')
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
/deep/ .el-cascader {
  width: 100%;
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

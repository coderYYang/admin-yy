<template>
  <div class='goods-add'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title='添加商品信息' type='info' show-icon :closable='false' center></el-alert>
      <el-steps :space='200' :active='activeIndex - 0' finish-status='success' align-center>
        <el-step title='基本信息'></el-step>
        <el-step title='商品参数'></el-step>
        <el-step title='商品属性'></el-step>
        <el-step title='商品图片'></el-step>
        <el-step title='商品内容'></el-step>
        <el-step title='完成'></el-step>
      </el-steps>
      <el-form ref='addRef' :model='addForm' :rules='addRules' label-width='100px' label-position='top'>
        <el-tabs v-model='activeIndex' tab-position='left' :before-leave='beforeTabLeave' @tab-click='tabClick'>
          <el-tab-pane label='基本信息' name='0'>
            <el-form-item label='商品名称' prop='goods_name'>
              <el-input v-model='addForm.goods_name' />
            </el-form-item>
            <el-form-item label='商品价格' prop='goods_price'>
              <el-input v-model='addForm.goods_price' type='number' />
            </el-form-item>
            <el-form-item label='商品重量' prop='goods_weight'>
              <el-input v-model='addForm.goods_weight' type='number' />
            </el-form-item>
            <el-form-item label='商品数量' prop='goods_number'>
              <el-input v-model='addForm.goods_number' type='number' />
            </el-form-item>
            <el-form-item label='商品分类' prop='goods_cat'>
              <el-cascader v-model='addForm.goods_cat' :options='cateList' :props='cateProps'
                           @change='handleChange' placeholder='请选择'></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品参数' name='1'>
            <el-form-item :label='item.attr_name' v-for='item in manyData' :key='item.attr_id'>
              <el-checkbox-group v-model='item.attr_vals'>
                <el-checkbox :label='item1' v-for='(item1, index1) in item.attr_vals' :key='index1' border />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品属性' name='2'>
            <el-form-item :label='item.attr_name' v-for='item in onlyData' :key='item.attr_id'>
              <el-input v-model='item.attr_vals'></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品图片' name='3'>
            <el-upload :action='action' :headers='headers' :on-preview='handlePreview' :on-remove='handleRemove'
                       list-type='picture' :on-success='handleSuccess'>
              <el-button type='primary'>上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label='商品内容' name='4'>
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model='addForm.goods_introduce'></quill-editor>
            <el-button type='primary' size='mini' style='margin-top: 15px;' @click='btnAdd'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog v-model='imgUrlDialog' title='图片预览' width='50%'>
      <img :src='imgUrl' alt='图片预览' class='imgUrl'>
    </el-dialog>
  </div>
</template>

<script>
import { Category, CategoryList, AddGoods } from '@/api/api'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import QuillEditor from 'vue-quill-editor/src/editor'

export default {
  name: 'GoodsAdd',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      // 商品参数
      manyData: [],
      onlyData: [],
      action: 'https://lianghj.top:8888/api/private/v1/upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgUrl: '',
      imgUrlDialog: false
    }
  },
  components: { QuillEditor },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList() {
      Category().then(res => {
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // 商品分类
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 标签页事件
    beforeTabLeave(newValue, oldValue) {
      if (oldValue == '0' && this.addForm.goods_cat.length !== 3) {
        ElMessage.warning('请先选择商品分类')
        return false
      }
    },
    // 获取参数列表数据
    getCategoryList(params) {
      CategoryList(this.cateId, params).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          if (this.activeIndex == '1') {
            res.data.data.forEach(val => {
              val.attr_vals = val.attr_vals.length === 0 ? [] : val.attr_vals.split(' ')
            })
            this.manyData = res.data.data
          }
          if (this.activeIndex == '2') {
            this.onlyData = res.data.data
          }
          // this.manyData = res.data.data
        } else {
          ElMessage.error(res.data.meta.msg)
        }
      })
    },
    // tabs 点击事件
    tabClick() {
      if (this.activeIndex == '1') {
        let params = { sel: 'many' }
        this.getCategoryList(params)
      }
      if (this.activeIndex == '2') {
        let params = { sel: 'only' }
        this.getCategoryList(params)
      }
    },
    // 预览图片
    handlePreview(file) {
      this.imgUrl = file.response.data.url
      this.imgUrlDialog = true
    },
    // 删除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const path = this.addForm.pics.findIndex(x => x.pic == filePath)
      this.addForm.pics.splice(path, 1)
    },
    // 图片上传成功
    handleSuccess(res) {
      if (res.meta.status === 200) {
        const picsId = { pic: res.data.tmp_path }
        this.addForm.pics.push(picsId)
        ElMessage.success(res.meta.msg)
      }
    },
    // 商品内容添加商品
    btnAdd() {
      this.$refs.addRef.validate(val => {
        if (val) {
          // 深拷贝
          const arr = JSON.parse(JSON.stringify(this.addForm));
          arr.goods_cat = arr.goods_cat.join(',');
          // 处理动态参数
          this.manyData.forEach(val => {
            let newObj = {
              attr_id: val.attr_id,
              attr_value: val.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newObj);
          })
          // 处理静态参数
          this.onlyData.forEach(val => {
            let newObj = {
              attr_id: val.attr_id,
              attr_value: val.attr_vals
            }
            this.addForm.attrs.push(newObj);
          })
          arr.attrs = this.addForm.attrs;
          AddGoods(arr).then(res => {
            if (res.data.meta.status === 201) {
              ElMessage.success(res.data.meta.msg);
              this.$router.push('/goods');
            } else {
              ElMessage.error(res.data.meta.msg);
            }
          })
        } else {
          ElMessage.warning('请填写必要表单项');
        }
      })
    }
  }
}
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}

/deep/ .el-step__title {
  font-size: 13px;
}

.el-checkbox {
  margin: 0 10px 0 !important;
}

.imgUrl {
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
/deep/ .ql-editor {
  height: 300px;
}
</style>

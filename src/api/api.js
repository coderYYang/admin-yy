import request from "@/api/request"

// 登入
export function Login(data) {
  return request({
    method: 'post',
    url: '/login',
    data: data
  })
}

/* 用户管理 */
// 获取左侧菜单
export function Menu() {
  return request({
    method: 'get',
    url: '/menus'
  })
}

// 获取用户信息
export function Users(params) {
  return request({
    method: 'get',
    url: '/users',
    params: params
  })
}

// 更新用户状态
export function UserStatus(data) {
  return request({
    method: 'put',
    url: '/users/' + data.uId + '/state/' + data.type,
  })
}

// 添加用户
export function AddUser(data) {
  return request({
    method: 'post',
    url: '/users',
    data: data
  })
}

// 根据 id 获取用户详细信息
export function UserDetail(params) {
  return request({
    method: 'get',
    url: '/users/' + params
  })
}

// 修改用户信息
export function EditUser(params, data) {
  return request({
    method: 'put',
    url: '/users/' + params,
    data: data
  })
}

// 删除用户
export function DeleteUser(params) {
  return request({
    method: 'delete',
    url: '/users/' + params
  })
}

// 分配用户角色
export function SetUserRole(userId, data) {
  return request({
    method: 'put',
    url: '/users/' + userId + '/role',
    data: data
  })
}


/* 权限管理 */
// 获取权限列表数据
export function Rights(params) {
  return request({
    method: 'get',
    url: '/rights/' + params
  })
}

// 获取角色列表
export function Roles() {
  return request({
    method: 'get',
    url: '/roles'
  })
}

// 删除角色指定权限
export function DeleteRoles(params) {
  return request({
    method: 'delete',
    url: '/roles/' + params.roleId + '/rights/' + params.rightId
  })
}

// 角色授权
export function SetRoles(roleId, data) {
  return request({
    method: 'post',
    url: '/roles/' + roleId + '/rights',
    data: data
  })
}

// 根据 ID 查询角色
export function GetRoles(Id) {
  return request({
    method: 'get',
    url: '/roles/' + Id
  })
}

// 修改角色信息
export function EditRoles(data) {
  return request({
    method: 'put',
    url: '/roles/' + data.roleId,
    data: data
  })
}

// 删除角色
export function RolesDeleteUser(deleteId) {
  return request({
    method: 'delete',
    url: '/roles/' + deleteId
  })
}

/* 商品管理 */
// 商品分类数据列表
export function Category(params) {
  return request({
    method: 'get',
    url: '/categories',
    params: params
  })
}

// 添加分类
export function AddCategory(data) {
  return request({
    method: 'post',
    url: '/categories',
    data: data
  })
}

// 获取参数列表
export function CategoryList(cateId, params) {
  return request({
    method: 'get',
    url: '/categories/' + cateId + '/attributes',
    params: params
  })
}

// 添加动态参数或静态属性
export function AddParams(cateId, data) {
  return request({
    method: 'post',
    url: '/categories/' + cateId + '/attributes',
    data: data
  })
}

// 编辑，根据 id 查询参数
export function SearchEdit(cateId, attrId, params) {
  return request({
    method: 'get',
    url: '/categories/' + cateId + '/attributes/' + attrId,
    params: params
  })
}

// 编辑提交参数
export function PutEdit(cateId, attrId, data) {
  return request({
    method: 'put',
    url: '/categories/' + cateId + '/attributes/' + attrId,
    data: data
  })
}

// 删除参数
export function DeleteCategory(params) {
  return request({
    method: 'delete',
    url: '/categories/' + params.id + '/attributes/' + params.attrId
  })
}

// 编辑提交参数
export function SaveAttrVals(params, data) {
  return request({
    method: 'put',
    url: '/categories/' + params.id + '/attributes/' + params.attrId,
    data: data
  })
}

// 获取商品列表数据
export function GetGoods(params) {
  return request({
    method: 'get',
    url: '/goods',
    params: params
  })
}

// 删除商品
export function GoodsDelete(id) {
  return request({
    method: 'delete',
    url: '/goods/' + id
  })
}

// 上传图片
export function UploadImg(data) {
  return request({
    method: 'post',
    url: '/upload',
    data: data
  })
}

// 添加商品
export function AddGoods(data) {
  return request({
    method: 'post',
    url: '/goods',
    data: data
  })
}

// 根据 id 查询分类
export function GetIdCate(catId) {
  return request({
    method: 'get',
    url: '/categories/' + catId
  })
}

// 编辑提交分类
export function EditSubmit(data) {
  return request({
    method: 'put',
    url: '/categories/' + data.cat_id,
    data: data
  })
}

// 删除分类
export function DeleteIdCate(catId) {
  return request({
    method: 'delete',
    url: '/categories/' + catId
  })
}

// 根据 ID 查询商品
export function GetIdGoods(goodsId) {
  return request({
    method: 'get',
    url: '/goods/' + goodsId
  })
}

// 编辑提交商品
export function EditGoods(data) {
  return request({
    method: 'put',
    url: '/goods/' + data.goods_id,
    data: data
  })
}

/* 订单管理 */
// 获取订单列表数据
export function OrderList(params) {
  return request({
    method: 'get',
    url: '/orders',
    params: params
  })
}

// 查看物流信息
export function LookCourier() {
  return request({
    method: 'get',
    url: '/kuaidi/' + '1106975712662'
  })
}

/* 数据统计 */
// 获取时间折线图数据
export function TimeReports() {
  return request({
    method: 'get',
    url: '/reports/type/1'
  })
}

import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登入'
    }
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: () => import('@/views/Home'),
    meta: {
      title: '主页'
    },
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/Welcome'),
        meta: {
          title: '欢迎'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/user/Users'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('@/views/power/Rights'),
        meta: {
          title: '权限列表'
        }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/power/Roles'),
        meta: {
          title: '角色列表'
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/goods/Cate'),
        meta: {
          title: '商品管理'
        }
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('@/views/goods/Params'),
        meta: {
          title: '分类参数'
        }
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('@/views/goods/Goods'),
        meta: {
          title: '商品列表'
        }
      },
      {
        path: '/goods/add',
        name: 'GoodsAdd',
        component: () => import('@/views/goods/GoodsAdd'),
        meta: {
          title: '添加商品'
        }
      },
      {
        path: '/orders',
        name: 'Order',
        component: () => import('@/views/order/Order'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/reports/Reports'),
        meta: {
          title: '数据报表'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next() 是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '超新刷课'
  }
  if (to.path === '/login') {
    return next();
  }
  const token = window.sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  } else {
    next();
  }
})

export default router

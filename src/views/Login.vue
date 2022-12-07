<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/image/bareheaded.jpg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-info"
                    :show-password="true"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="mini" @click="login">登入</el-button>
          <el-button type="info" size="mini" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Login } from "@/api/api";

export default {
  name: "Login",
  data() {
    return {
      // 绑定用户名密码
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证用户名和密码是否合法
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在6-15个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 登入
    login() {
      this.$refs.loginFormRef.validate(val => {
        if (!val) return;
        Login(this.loginForm).then(res => {
          if (res.data.meta.status === 200) {
            ElMessage.success(res.data.meta.msg)
            window.sessionStorage.setItem('token', res.data.data.token);
            window.sessionStorage.setItem('username', res.data.data.username);
            this.$router.push('/home');
          } else {
            ElMessage.error('登入失败')
          }
        })
      })
    },
    // 重置表单
    reset() {
      this.$refs.loginFormRef.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar-box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="login_container">
    <!-- el-plus的栅格系统分24列 -->
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到开润系统</h2>

          <!-- 账号表单 -->
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <!-- 密码表单 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              :prefix-icon="Lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>

          <!-- 表单按钮 -->
          <el-form-item>
            <el-button
              :loading="Loading"
              class="loginBtn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { ElNotification } from 'element-plus'
//引入时间函数
import { getTime } from '@/utils/times'
// 引入路由实例
import { useRoute } from 'vue-router'

let $route = useRoute()
// 获取表单元素
let loginForms = ref()
// 控制按钮加载变量
let Loading = ref(false)
let useStore = useUserStore()
// 获取路由器
let $router = useRouter()
// 收集账号和密码的数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// 登录按钮的回调函数
const login = async () => {
  // 保证校验通过再发请求
  await loginForms.value.validate()
  // 按钮开始加载
  Loading.value = true
  // 通知仓库发登录请求
  try {
    // 请求成功=>挑战到首页
    await useStore.userLogin(loginForm)
    // 判断是否有query参数
    let redirect: any = $route.query.redirect
    // 编程式导航
    $router.push({ path: redirect || '/' })

    // 提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}。`,
      position: 'bottom-right',
    })
    // 刷新页面
    location.reload()
    Loading.value = false
  } catch (error) {
    Loading.value = false
    // 请求失败=>弹出信息,加载消失
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // rule是校验规则对象
  // value是表单元素的文本内容
  // callback是符不符合条件
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度五位数以上'))
  }
}
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度六位数以上'))
  }
}

// 定义表单校验的rule对象
let rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    //自定义校验规则
    { trigger: 'change', validator: validatorUserName },
    // { min: 5, max: 10, message: '账号长度至少六位至多十位', trigger: 'change' },
  ],
  password: [
    { trigger: 'change', validator: validatorPassWord },
    // { required: true, message: '密码不能为空', trigger: 'blur' },
    // { min: 5, max: 10, message: '密码长度至少六位至多十位', trigger: 'change' },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  // 使背景图片完全覆盖背景区域
  background-size: cover;
}

.login {
  position: relative;
  display: inline-block;
  width: 70%;
  top: 30vh;
  background-size: cover;
  background-color: rgba(149, 148, 148, 0.1);
  padding: 60px;
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0;
  }
  .loginBtn {
    width: 100%;
  }
}
</style>

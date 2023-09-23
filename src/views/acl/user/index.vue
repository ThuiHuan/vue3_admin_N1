<template>
  <!-- 顶部栏 -->
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input
          style="width: 200px"
          placeholder="请输入用户名"
          v-model="userArr"
          @keyup.enter.native="SearchUser"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template #="">
          <el-button
            size="default"
            type="primary"
            @click="SearchUser"
            :disabled="userArr ? false : true"
          >
            搜索
          </el-button>
          <el-button size="default" type="danger" @click="reset">
            重置
          </el-button>
        </template>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 内容区域 -->
  <el-card style="margin: 20px 0">
    <el-button type="primary" @click="addUser" v-has="`btn.User.add`">
      添加用户
    </el-button>
    <el-button
      type="danger"
      @click="DeleteArr"
      :disabled="idList.length ? false : true"
    >
      批量删除
    </el-button>
    <el-table
      style="margin: 10px 0"
      border
      :data="userParams"
      @selection-change="selectChange"
    >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column
        align="center"
        label="#"
        type="index"
        width="100px"
      ></el-table-column>
      <el-table-column label="id" width="100px" prop="id"></el-table-column>
      <el-table-column label="用户姓名(账号)" prop="username"></el-table-column>
      <el-table-column label="用户昵称" prop="name"></el-table-column>
      <el-table-column label="用户角色" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="400px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            icon="user"
            size="small"
            @click="setRole(row)"
            v-has="`btn.User.assgin`"
          >
            分配角色
          </el-button>
          <el-button
            type="warning"
            icon="edit"
            size="small"
            @click="editUser(row)"
            v-has="`btn.User.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="你确定要删除这个用户吗?"
            @confirm="deleteUser(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="delete"
                size="small"
                v-has="`btn.User.remove`"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="handler"
      @current-change="getUsers"
    />
  </el-card>

  <!-- 新增/修改抽屉 -->
  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h3>{{ userData.id ? '修改用户' : '添加用户' }}</h3>
    </template>
    <template #default>
      <div>
        <!-- 表单 -->
        <el-form
          :data="userParams"
          ref="ruleFormRef"
          :model="userData"
          :rules="rules"
        >
          <el-form-item label="用户姓名：" prop="username">
            <el-input
              style="width: 400px"
              placeholder="请填写用户姓名"
              v-model="userData.username"
            />
          </el-form-item>
          <el-form-item label="用户昵称：" prop="name">
            <el-input
              style="width: 400px"
              placeholder="请填写用户昵称"
              v-model="userData.name"
            />
          </el-form-item>
          <el-form-item v-if="!userData.id" prop="password" label="用户密码：">
            <el-input
              style="width: 400px"
              placeholder="请填写用户密码"
              v-model="userData.password"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 分配角色抽屉 -->
  <el-drawer v-model="drawer2">
    <template #header>
      <h4>选择角色</h4>
    </template>
    <template #default>
      <div>
        <!-- 表单元素显示账号名称 -->
        <el-form :data="userData">
          <el-form-item label="用户姓名">
            <el-input disabled="true" v-model="userData.username"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <div>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="indeterminate"
                @change="checkAllChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group v-model="assignRoles" @change="groupChange">
                <el-checkbox
                  v-for="(role, index) in allRolesList"
                  :key="index"
                  :label="role"
                >
                  {{ role.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
// 引入请求地址
import {
  reqDeleteUsers,
  reqDeleteUser,
  reqGetUsers,
  reqAddOrUpdateUSer,
  reqAllRole,
  reqSetUserRole,
} from '@/API/acl/user/index'
// 引入ts类型
import {
  setRole,
  AllRole,
  AllRoleResponseData,
  ResponseData,
  records,
} from '@/API/acl/user/type'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import useLayOut from '@/store/modules/setting'
let refreshStore = useLayOut()
let userStore = useUserStore()
// 批量删除的id值
let idList = ref<number[]>([])
// 全选框收集数据
let checkAll = ref<boolean>(false)
// 设置不确定样式状态
let indeterminate = ref<boolean>(true)
// 全部职位
let allRolesList = ref<AllRole>([])
// 收集职位 checkCities
let assignRoles = ref<any>([])
//默认页码
let pageNo = ref<number>(1)
// 默认条数
let pageSize = ref<number>(5)
// 总数
let total = ref(0)
// 用户数据
let userParams = ref<records[]>([])
// 控制新增抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer2 = ref<boolean>(false)
// 收集新增的数据
let userData = reactive<records>({
  // 昵称
  name: '',
  // 姓名
  username: '',
  password: '',
})
// 修改当前账号的标记
let flag = ref<boolean>(false)
// 用户搜索
let userArr = ref<string>('')
// 重置的监听
// let flag_reset = ref(true)

//用户名的校验规则
const validatorUsername = (_rules: any, value: any, callback: any) => {
  // 用户名称的长度至少是五位
  if (value.trim().length >= 5) callback()
  else {
    callback(new Error('用户名至少是五位'))
  }
}
// 密码的自定义校验规则
const validatorPassword = (_rules: any, value: any, callback: any) => {
  // 用户名称的长度至少是五位
  if (value.trim().length >= 5) callback()
  else {
    callback(new Error('密码至少是六位'))
  }
}
// 获取form组件对象的实例
const ruleFormRef = ref<FormInstance>()
// 表单规则
const rules = reactive<FormRules<any>>({
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorUsername,
    },
  ],
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入内容',
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入内容',
      validator: validatorPassword,
    },
  ],
})

// 获取用户信息
const getUsers = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: ResponseData = await reqGetUsers(pageNo.value, pageSize.value)
  if (result.code == 200) {
    // 存储数据
    userParams.value = result.data.records
    // 更新总数
    total.value = result.data.total
  }
}
// 生命周期钩子，挂载后
onMounted(() => {
  getUsers()
})
// 分页器下拉菜单
const handler = () => {
  getUsers()
}
// 添加用户
const addUser = () => {
  nextTick(() => {
    // 清空验证规则提示
    ruleFormRef.value?.clearValidate('username')
    ruleFormRef.value?.clearValidate('name')
    ruleFormRef.value?.clearValidate('password')
  })
  // 清空数据
  userData.name = ''
  // 姓名
  userData.username = ''
  userData.password = ''
  userData.id = ''
  drawer.value = true
}
// 更新用户
const editUser = (row: records) => {
  //如果更改的是当前已登录账号,浏览器自动刷新一次，因为路由改变会发请求获取用户信息
  if (userStore.username == row.username) {
    flag.value = true
  }
  nextTick(() => {
    // 清空验证规则提示
    ruleFormRef.value?.clearValidate('username')
    ruleFormRef.value?.clearValidate('name')
    ruleFormRef.value?.clearValidate('password')
  })
  // 显示抽屉
  drawer.value = true
  // 存储从表格中拿到数据
  // userData.name = row.name
  // userData.username = row.username
  // userData.id = row.id
  Object.assign(userData, row)
}
// 新增模块的提交按钮
const confirmClick = async () => {
  // 清空更新时间
  userData.updateTime = ''
  // 点击保存按钮，符合条件发请求
  await ruleFormRef.value?.validate()
  let result: any = await reqAddOrUpdateUSer(userData)
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示消息
    ElMessage({
      type: 'success',
      message: userData.id ? '修改成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: userData.id ? '修改失败,内容可能重复' : '添加失败,内容可能重复',
    })
  }
  //更新数据
  getUsers(userData.id ? pageNo.value : 1)
  // 如果标记改变，说明是修改当前登录的账号
  if (flag.value == true) {
    window.location.reload()
  }
}
// 取消提交
const cancelClick = () => {
  drawer.value = false
}
const cancel = () => {
  drawer2.value = false
}

// 分配角色按钮
const setRole = async (row: any) => {
  // 合并数据（存储数据并展示）
  Object.assign(userData, row)
  // 发请求
  const result: AllRoleResponseData = await reqAllRole(row.id)
  if (result.code == 200) {
    // 存储数据
    allRolesList.value = result.data.allRolesList
    assignRoles.value = result.data.assignRoles
    // 展示抽屉
    drawer2.value = true
  }
}
// 全选复选框的chagne事件
const checkAllChange = (value: boolean) => {
  // 如果全选了，就把所有的职位都赋值进去
  assignRoles.value = value ? allRolesList.value : []
  indeterminate.value = false
}
// 底部复选框change事件
const groupChange = (value: string[]) => {
  // 已经勾选的项目的长度
  let len = value.length
  // 修改全选的状态
  checkAll.value = len == allRolesList.value.length
  // 修改不确定样式的状态
  indeterminate.value = !(len == allRolesList.value.length)
}
// 分配角色的提交按钮
const save = async () => {
  // 发请求修改权限
  let result: any = await reqSetUserRole({
    userId: userData.id,
    roleIdList: assignRoles.value.map((item: any) => item.id),
  })
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '分配失败',
    })
  }
  // 更新数据
  getUsers(pageNo.value)
  // 关闭抽屉
  drawer2.value = false
}
// 删除用户
const deleteUser = async (row: any) => {
  // 发请求
  const result: any = await reqDeleteUser(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
  // 刷新数据
  getUsers(userParams.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
// 选项框事件
const selectChange = async (value: any) => {
  // 获取全部已选中的id
  idList.value = value.map((item: any) => item.id)
}
// 批量删除
const DeleteArr = async () => {
  // 发送请求
  let result: any = await reqDeleteUsers(idList.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
  getUsers(userParams.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
// 搜索用户
const SearchUser = async () => {
  // 发送请求
  const result: ResponseData = await reqGetUsers(
    pageNo.value,
    pageSize.value,
    userArr.value,
  )
  if (result.code == 200) {
    // 存储数据
    userParams.value = result.data.records
    // 更新总数
    total.value = result.data.total
  }
  // 清空搜索框
  userArr.value = ''
}
// 重置
const reset = () => {
  refreshStore.refsh = !refreshStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

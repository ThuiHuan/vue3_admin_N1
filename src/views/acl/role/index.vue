<template>
  <!-- 顶部栏 -->
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input
          style="width: 200px"
          placeholder="请输入职位名"
          v-model="inputRole"
          @keyup.enter.native="searchRole"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template #="">
          <el-button
            size="default"
            type="primary"
            @click="searchRole"
            :disabled="inputRole ? false : true"
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
    <el-button type="primary" @click="addUser" v-has="`btn.Role.add`">
      添加用户
    </el-button>
    <el-table :data="RoleData" style="margin: 10px 0" border>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column
        align="center"
        label="#"
        type="index"
        width="150px"
      ></el-table-column>
      <el-table-column
        label="id"
        prop="id"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="400px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            icon="user"
            size="small"
            @click="givenRole(row)"
            v-has="`btn.Role.assgin`"
          >
            分配角色
          </el-button>
          <el-button
            type="warning"
            icon="edit"
            size="small"
            @click="updateRole(row)"
            v-has="`btn.Role.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="你确定要删除这个用户吗?"
            @confirm="removeItem(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="delete"
                size="small"
                v-has="`btn.Role.remove`"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器-->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="getRole"
      @current-change="getRole"
    />
  </el-card>

  <!-- 添加的对话框 -->
  <el-dialog v-model="dialogFormVisible" title="添加" width="600px">
    <el-form :model="roleQuery" :rules="rules" ref="ruleFormRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleQuery.roleName" placeholder="请填写角色的名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h2>分配权限</h2>
    </template>
    <template #default>
      <div>
        <!-- 将数据中select为真的id筛选出来 -->
        <el-tree
          ref="tree"
          :data="AllAssignData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
// 引入请求
import {
  reqAddOrUpdateRole,
  reqAssign,
  reqGetRole,
  reqRemoveRole,
  reqPostAssign,
} from '@/API/acl/role'
// 引入ts类型
import {
  AssignRespoens,
  GetRole,
  Records,
  RolesList,
} from '@/API/acl/role/type'
import { nextTick, onMounted, reactive, ref } from 'vue'
// 引入仓库
import useLayOut from '@/store/modules/setting.ts'
import { ElMessage } from 'element-plus'
let refreshStore = useLayOut()
import type { FormRules } from 'element-plus'

// 表单规则的类型
interface RuleForm {
  roleName: string
}

//页数
let pageNo = ref<number>(1)
// 展示的数据条数
let pageSize = ref<number>(5)
// 总数
let total = ref<number>(3)
// 存储权限数据
let RoleData = ref<Records[]>([])
// 存储搜索框的输入
let inputRole = ref<string>('')
// 对话框的控制
let dialogFormVisible = ref<boolean>(false)
// 收集的角色名称
let roleQuery = reactive<any>({
  id: '',
  roleName: '',
})
// 获取表单实例对象
let ruleFormRef = ref<any>()
// 抽屉的标记
let drawer = ref(false)
// 存储所有要分配权限的数据
let AllAssignData = ref<RolesList[]>([])
// 准备一个存储树形节点勾选的四级节点的id
let selectArr = ref<any>([])
// 获取树形控件的组件实例
let tree = ref<any>()

// 默认的树形控件配置
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 获取权限数据
const getRole = async (pager = 1) => {
  pageNo.value = pager
  let result: GetRole = await reqGetRole(
    pageNo.value,
    pageSize.value,
    inputRole.value,
  )
  // 存储数据
  if (result.code == 200) RoleData.value = result.data.records
  // 修改总数
  total.value = result.data.total
}
// 页面挂载完毕请求数据
onMounted(() => {
  getRole()
})
// 搜索
const searchRole = async () => {
  getRole()
  // 清空输入框
  inputRole.value = ''
}
// 重置按钮
const reset = () => {
  refreshStore.refsh = !refreshStore.refsh
}
// 添加按钮
const addUser = () => {
  // 清楚表单校验信息
  nextTick(() => {
    ruleFormRef.value?.clearValidate('roleName')
  })
  //显示对话框
  dialogFormVisible.value = true
  //清楚数据
  for (var key in roleQuery) {
    delete roleQuery[key]
  }
}
// 确定
const save = async () => {
  // 清空更新时间
  roleQuery.updateTime = ''
  // 校验通过发请求
  await ruleFormRef.value.validate()
  // 发请求
  const result: any = await reqAddOrUpdateRole(roleQuery)
  if (result.code == 200) {
    // 提示添加成功，关闭对话框，刷新数据
    ElMessage({
      type: 'success',
      message: roleQuery.id ? '更新成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: roleQuery.id ? '更新失败' : '添加失败',
    })
  }
  dialogFormVisible.value = false
  getRole(roleQuery.id ? pageNo.value : 1)
}
// 更新用户信息
const updateRole = (row: any) => {
  // 清空表单校验规则
  nextTick(() => {
    ruleFormRef.value?.clearValidate('roleName')
  })
  dialogFormVisible.value = true
  // 存储信息
  Object.assign(roleQuery, row)
}
// 删除单个表格信息
const removeItem = async (row: any) => {
  const result: any = await reqRemoveRole(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
  // 更新数据
  getRole(RoleData.value.length ? pageNo.value : pageNo.value - 1)
}
// 分配权限按钮
const givenRole = async (row: Records) => {
  Object.assign(roleQuery, row)
  // 发送请求获取数据
  const result: AssignRespoens = await reqAssign(roleQuery.id as number)
  // 存储数据
  AllAssignData.value = result.data
  drawer.value = true
  // 递归存储最底层节点,并存储数据
  // selectArr.value = filterSelectArr(AllAssignData.value, [])
  selectArr.value = filterSelectArr(AllAssignData.value, [])
}
// 递归找到最底层节点
const filterSelectArr = (allData: any, initArr: any) => {
  // 遍历数组
  allData.forEach((item: any) => {
    // 只要四级节点的select选中的id
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    // 递归 获取到最低层的level
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 分配权限的确定按钮
const confirmClick = async () => {
  // 选中的id
  let arr = tree.value.getCheckedKeys()
  // 半选的id
  let arr1 = tree.value.getHalfCheckedKeys()
  // 合并数组
  let permissionId = arr.concat(arr1)
  const result: any = await reqPostAssign(roleQuery.id, permissionId)
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '操作失败',
    })
  }
}

// 自定义表单规则
const RoleNamevalidator = (_rule: any, value: any = '', callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名不能小于两位'))
  }
}
// 表单校验规则
const rules = reactive<FormRules<RuleForm>>({
  roleName: [{ required: true, trigger: 'blur', validator: RoleNamevalidator }],
})

// 取消
const cancelClick = () => {
  // 关闭抽屉
  drawer.value = false
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
}
</style>

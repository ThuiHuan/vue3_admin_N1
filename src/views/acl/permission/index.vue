<template>
  <div>
    <el-table
      :data="PermissionData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="address" label="操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="addPermission(row)"
            :disabled="row.level == 4 ? true : false"
            v-has="`btn.Permission.add`"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="warning"
            size="small"
            :disabled="row.level == 1 ? true : false"
            @click="updatePermiss(row)"
            v-has="`btn.Permission.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="你确定要删除这条数据吗？"
            @confirm="removeMenu(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                :disabled="row.level == 1 ? true : false"
                v-has="`btn.Permission.remove`"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 对话框 -->
  <el-dialog v-model="dialogFormVisible" title="Tips" style="width: 500px">
    <el-form label-width="60px">
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name" />
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请你输入权限值" v-model="menuData.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入方法
import {
  reqAddPermission,
  reqGetPermission,
  reqRemovePermission,
} from '@/API/acl/menu/index'
// 引入数据类型
import { AllPermission, RolesList } from '@/API/acl/menu/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref, reactive } from 'vue'

// 存储的菜单数据
let PermissionData = ref<RolesList[]>([])
// 对话框的标记
let dialogFormVisible = ref(false)
// 新增的数据
let menuData = reactive<any>({
  id: '',
  code: '',
  level: 0,
  name: '',
  pid: '', //菜单的id
})
onMounted(() => {
  getPermission()
})

// 获取数据
const getPermission = async () => {
  const result: AllPermission = await reqGetPermission()
  // 存储数据
  PermissionData.value = result.data
}
// 添加按钮
const addPermission = (row: RolesList) => {
  // 清空数据
  // for (var k in menuData) {
  //   delete menuData[k]
  // }
  Object.assign(menuData, {
    id: '',
    code: '',
    level: 0,
    name: '',
    pid: '', //菜单的id
  })
  dialogFormVisible.value = true
  // 获取当前level值，添加的时候添加到子菜单列表
  menuData.level = row.level + 1
  // 获取当前的菜单id
  menuData.pid = row.id
}
// 修改按钮
const updatePermiss = (row: RolesList) => {
  // 收集已有的菜单数据
  Object.assign(menuData, row)
  dialogFormVisible.value = true
}

// 提交按钮
const save = async () => {
  // 发送请求
  const result: any = await reqAddPermission(menuData)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    // 关闭弹窗
    dialogFormVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
  // 刷新数据
  getPermission()
}
// 删除按钮
const removeMenu = async (row: RolesList) => {
  const result: any = await reqRemovePermission(row.id)
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
  getPermission()
}
</script>

<style scoped></style>

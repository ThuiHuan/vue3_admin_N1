<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <!-- 内容区域 -->
    <el-card style="margin: 10px 0px">
      <!-- 属性展示区域 -->
      <div v-show="scene == 0">
        <el-button
          v-has="`btn.Attr.add`"
          @click="AddAttr"
          icon="Plus"
          type="primary"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加平台属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <!-- 遍历属性值名称 -->
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160px">
            <template #="{ row }">
              <el-button
                type="warning"
                icon="edit"
                size="small"
                @click="UpdateAttr(row)"
                v-has="`btn.Attr.update`"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}吗?`"
                width="250px"
                icon="Delete"
                @confirm="deleteAttr(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="delete"
                    v-has="`btn.Attr.remove`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 属性添加/修改区域 -->
      <div v-show="scene != 0">
        <el-form inline>
          <el-form-item
            label="属性名称"
            style="margin-right: 0px"
          ></el-form-item>
          <el-form-item>
            <el-input
              v-model="attrParams.attrName"
              style="width: 180px"
              placeholder="请您输入属性的名字"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 20px">
          <el-button
            @click="addAttrValue"
            icon="Plus"
            type="primary"
            :disabled="!attrParams.attrName"
          >
            添加属性值
          </el-button>
          <el-button @click="cancelAdd">取消</el-button>
        </div>
        <el-table border :data="attrParams.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-input
                @blur="toLook(row, $index)"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ $index }">
              <el-button
                icon="delete"
                type="danger"
                size="small"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancelAddAttr">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick, onBeforeMount } from 'vue'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category.ts'
// 引入商品属性相关请求方法
import {
  reqAttrInfoList,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from '@/API/product/attr/index'
// 引入ts数据类型
import { AttrResponseData, AttrList, AttrValue } from '@/API/product/attr/type'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attrArr = ref<AttrList>([])
// 定义卡片组件内容切换的变量
let scene = ref<number>(0) //默认为0展示属性——1为展示添加
// 收集新增属性的数据
let attrParams = reactive<any>({
  id: '',
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: [],
})
// 存储input对应的组件实例
let inputArr = ref<any>([])

// 监听三级分类的id 有就发请求
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    //保证三级分类有才能发请求
    if (!categoryStore.c3Id) {
      return
    }
    getAttr()
  },
)
// 获取属性数据
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
  // 存储属性数据data列表
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
// 添加属性
const AddAttr = async () => {
  //清空数据
  attrParams.attrName = ''
  attrParams.attrValueList = []
  // 修改卡片视图结构
  scene.value = 1
}
// 添加属性值
const addAttrValue = () => {
  // 收集三级分类的id
  attrParams.categoryId = categoryStore.c3Id
  // 添加属性对象
  attrParams.attrValueList.push({
    valueName: '',
  })
  // 获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}
// 保存按钮的回调
const save = async () => {
  // 发送请求
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切换页面
    scene.value = 0
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    // 更新数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
// 失焦回调
const toLook = (row: AttrValue, $index: number) => {
  // 不能空
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空！',
    })
  }

  //非法情况：属性值不能重复
  let repeat = attrParams.attrValueList.find((item: AttrValue) => {
    // 扣除当前失去焦点属性值对象
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  // 如果有重复
  if (repeat) {
    // 删掉当前行
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复！',
    })
    return
  }
}
// 修改属性
const UpdateAttr = (row: AttrValue) => {
  // 修改卡片视图结构
  scene.value = 1
  // 将已有的属性对象赋值给attrparams对象
  // object.assign合并对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消添加属性
const cancelAdd = () => {
  //清空数据
  attrParams.attrName = ''
  attrParams.attrValueList = []
  categoryStore.c1Id = ''
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  // 切换视图
  scene.value = 0
}
// 取消添加属性值
const cancelAddAttr = () => {
  // 切换视图
  scene.value = 0
}
// 删除属性值
const deleteAttr = async (row: any) => {
  let result: AttrResponseData = await reqDeleteAttr(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 刷新数据
    getAttr()
  }
}
// 当路由组件销毁的时候清空仓库中分类相关数据
onBeforeMount(() => {
  // 清空该仓库数据
  categoryStore.$reset()
})
</script>

<style scoped>
el-button {
  color: white;
  font-size: 30px;
  font-weight: 800;
}
</style>

<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />

    <!-- 卡片 -->
    <el-card style="margin-top: 20px">
      <!-- 场景0 展示已有的c3Id的spu-->
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          style="margin-bottom: 20px"
          type="primary"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
        >
          添加SPU
        </el-button>
        <!-- 表格 -->
        <el-table border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                icon="Plus"
                type="primary"
                size="small"
                title="添加SKU"
                @click="AddSku(row)"
                v-has="`btn.Spu.addsku`"
              ></el-button>
              <el-button
                @click="editSpu(row)"
                icon="edit"
                type="warning"
                size="small"
                title="修改SPU"
                v-has="`btn.Spu.update`"
              ></el-button>
              <el-button
                icon="message"
                type="info"
                size="small"
                title="查看SPU"
                @click="GetSku(row)"
                v-has="`btn.Spu.skus`"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}吗?`"
                width="200px"
                @confirm="removeSku(row)"
              >
                <template #reference>
                  <el-button
                    icon="delete"
                    type="danger"
                    size="small"
                    title="删除SPU"
                    v-has="`btn.Spu.delete`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器
    @current-change页码发生变化
      -->
        <el-pagination
          @size-change="getSpu"
          @current-change="getSpu"
          style="margin-top: 20px"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :pager-count="7"
          :background="true"
          layout=" prev, pager, next, jumper,->,sizes,->,total"
          :total="total"
        />
      </div>

      <!-- 场景1 添加SPU|修改SPU -->
      <div v-show="scene == 1">
        <SpuFrom ref="spu" @changeScene="changeScene" />
      </div>
      <!-- 场景2  添加SKU-->
      <div v-show="scene == 2">
        <SkuFrom ref="sku" @changeScene="changeScene" />
      </div>

      <!-- 展示已有的sku数据 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuParams">
          <el-table-column label="sku名字" prop="skuName"></el-table-column>
          <el-table-column label="sku价格(元)" prop="price"></el-table-column>
          <el-table-column label="sku重量(g)" prop="weight"></el-table-column>
          <el-table-column label="sku图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 引入子组件
import SpuFrom from './spuForm.vue'
import SkuFrom from './skuForm.vue'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ref, watch } from 'vue'
// 引入ts类型
import type {
  HasSpuResponeseData,
  Records,
  SpuData,
  SkuInfoData,
} from '@/API/product/spu/type'
// 引入请求方法
import { reqSpuData, reqGetSku, reqRemoveSku } from '@/API/product/spu/index'
import { ElMessage } from 'element-plus'

// 仓库实例化
let categoryStore = useCategoryStore()
// 控制对话框显示与隐藏
let show = ref(false)
// 控制场景切换 0是已有的spu   1是添加修改/spu   2是添加sku
let scene = ref<number>(0)
// 分页器默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(3)
// 总数
let total = ref<number>()
// 获取子组件的实例对象
let spu = ref()
//  获取子组件的实例对象
let sku = ref()
// 存储请求到的sku数据
let skuParams = ref<SkuInfoData>()

// 监听三级分类的id
watch(
  () => {
    return categoryStore.c3Id
  },
  () => {
    // 得保证存在三级分类id
    if (!categoryStore.c3Id) {
      return
    }
    // 发送请求
    getSpu()
  },
)
// 存储Spu数据
let records = ref<Records[]>([])
// 获取Spu数据
const getSpu = async (pager = 1) => {
  // 不带参数，默认参数为1
  pageNo.value = pager
  let result: HasSpuResponeseData = await reqSpuData(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    // 更改total
    total.value = result.data.total
  }
}
// 添加spu
const addSpu = () => {
  //获取全部品牌和全部销售属性 将c3id传入,确保目标的分类
  spu.value.initAddSpuData(categoryStore.c3Id as number | string)
  // 切换为场景1
  scene.value = 1
}
// 修改spu
const editSpu = (row: Records) => {
  // //获取全部品牌和全部销售属性
  spu.value.initHasSpuData(row)

  // 切换为场景1
  scene.value = 1
}
// 添加sku
const AddSku = (row: SpuData) => {
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
  scene.value = 2
}
// 查看sku
const GetSku = async (row: SpuData) => {
  //显示对话框
  show.value = true
  // 发送请求
  let result: any = await reqGetSku(row.id as number)
  if (result.code == 200) {
    // 存储数据
    skuParams.value = result.data
  }
}
// 删除sku
let removeSku = async (row: SpuData) => {
  let result: any = await reqRemoveSku(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取数据
    getSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 子组件绑定的自定义事件  解构参数
const changeScene = (obj: any) => {
  if (obj.params == 'update') {
    getSpu(pageNo.value)
  } else {
    getSpu()
  }
  scene.value = obj.flag
}
</script>

<style scoped></style>

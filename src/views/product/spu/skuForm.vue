<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="sku名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        type="number"
        placeholder="价格(元)"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        type="number"
        placeholder="重量(g)"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        type="textarea"
        placeholder="sku描述"
        v-model="skuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          label-width="100px"
          v-for="item in attrArr"
          :label="item.attrName"
          :key="item.id"
        >
          <el-select v-model="item.attrIdAndvalueId">
            <el-option
              :label="value.valueName"
              v-for="value in item.attrValueList"
              :key="value.id"
              :value="`${item.id}:${value.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="平台销售属性">
      <el-form :inline="true">
        <el-form-item
          label-width="100px"
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndSaleValueId">
            <el-option
              v-for="value in item.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="`${item.id}:${value.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table
        border
        :data="imgArr"
        ref="table"
        @select="noselec"
        :header-cell-class-name="cellClassName"
      >
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="default" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入ts类型
import { SkuData } from '@/API/product/spu/type'
// 引入请求的PI 商品属性\照片属性\销售属性
import { reqAttrInfoList } from '@/API/product/attr/index'
//引入spu的图片|销售属性|sku方法
import { reqAllImage, reqSallAttr, reqAddSku } from '@/API/product/spu/index'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 自定义事件,给通知父组件修改场景
let $emit = defineEmits(['changeScene'])
// 获取table组件实例对象
let table = ref<any>()
// 存储照片数据
let imgArr = ref<any>([])
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 收集SKU的数据
let skuParams = reactive<SkuData>({
  // 父级传入的数据  category3Id|spuId|tmId
  category3Id: '',
  spuId: '', //目标spuid
  tmId: '', //品牌id
  // v-model收集
  skuName: '',
  price: '',
  weight: '',
  description: '',
  // 平台属性
  skuAttrValueList: [],
  // 销售属性
  skuSaleAttrValueList: [],
  // sku图片地址
  skuDefaultImg: '',
})

// 隐藏全选按钮
const cellClassName = (row: any) => {
  if (row.columnIndex === 0) {
    return 'DisableSelection'
  }
}
// checkbox
const noselec = (_select: any, row: any) => {
  // console.log(select)
  // 排他思想
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)
  // 返回当前选中行的数据
  let rowData = table.value.getSelectionRows()
  skuParams.skuDefaultImg = rowData[0].imgUrl
}

// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
// 设置默认图片的方法回调
const handler = (row: any) => {
  // 排他思想,图片复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 收集图片的地址
  skuParams.skuDefaultImg = row.imgUrl
  // 复选框选中
  table.value.toggleRowSelection(row, true)
}
// 保存
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    // 如果有attrIdAndvalueId说明选中了
    if (next.attrIdAndvalueId) {
      let [attrId, valueId] = next.attrIdAndvalueId.split(':')
      // 组合成对象,push到prev中
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])

  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndSaleValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndSaleValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  // 发请求
  let result: any = await reqAddSku(skuParams)
  // 成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    // 修改场景
    $emit('changeScene', { flag: 0, params: 'update' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
  // 失败
}

// 当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  row: any,
) => {
  // 清空数据
  skuParams.category3Id = ''
  skuParams.spuId = '' //目标spuid
  skuParams.tmId = '' //品牌id
  // v-model收集
  skuParams.skuName = ''
  skuParams.price = ''
  skuParams.weight = ''
  skuParams.description = ''
  // 平台属性
  skuParams.skuAttrValueList = []
  // 销售属性
  skuParams.skuSaleAttrValueList = []
  // sku图片地址
  skuParams.skuDefaultImg = ''

  // 发请求获取基础属性,平台属性,图片名称
  // 收集父组件传递过来的数据
  skuParams.category3Id = row.category3Id
  skuParams.spuId = row.id
  skuParams.tmId = row.tmId
  let result = await reqAttrInfoList(c1Id, c2Id, row.category3Id)
  let result1 = await reqAllImage(row.id)
  let result2 = await reqSallAttr(row.id)
  // 存储请求响应的数据
  attrArr.value = result.data
  saleArr.value = result2.data
  imgArr.value = result1.data
}
defineExpose({
  initSkuData,
})
</script>

<style scoped>
/* 隐藏全选框 */
::v-deep(.el-table .DisableSelection .cell .el-checkbox__inner) {
  display: none;
}
</style>

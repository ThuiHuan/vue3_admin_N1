<!-- 场景一：添加Spu -->
<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <!-- 收集数据 -->
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTraderMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 
        v-model:file-list:展示默认图片
        action：上传图片的接口地址
        list-type:文件列表的类型
        on-preview：预览图片
        on-remove：移除图片的钩子
       -->
      <el-upload
        v-model:file-list="imageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog style="width: 700px" v-model="dialogVisible">
        <img
          w-full
          :src="dialogImg"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <!-- 添加按钮 -->
      <el-button
        style="margin-left: 20px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!saleAttrIdAndName"
        @click="addSaleAttr"
        v-has="`btn.Spu.add`"
      >
        添加属性值
      </el-button>
      <!-- table 展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="属性名"
          width="120px"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <!-- $index是tag元素的数组顺序，而index是for循环中当前那一行的属性数组顺序 -->
            <el-tag
              style="margin: 0 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button
              v-if="!row.flag"
              type="primary"
              size="small"
              icon="Plus"
              color="#abd2ff"
              circle
              @click="addSaleAttrValue(row)"
            ></el-button>
            <el-input
              v-else
              size="small"
              style="width: 100px"
              placeholder="请你输入属性值"
              v-model="row.saleAttrValu"
              @blur="toLook(row, $index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ $index }">
            <el-button
              type="danger"
              size="small"
              icon="delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// ts类型
import type {
  SpuData,
  AllSallAttrResponse,
  spuImageList,
  SallAttrResponse,
  SallAttrList,
  AllSallAttr,
} from '@/API/product/spu/type'
import type { TradeMarkResponseData } from '@/API/product/trademark/type'
// 引入请求方法
import {
  UpdateSpu,
  reqAllTraderMark,
  reqAllImage,
  reqSallAttr,
  reqAllSallAttr,
} from '@/API/product/spu/index'
import { ref, computed, onBeforeMount } from 'vue'
import { UploadProps, ElMessage } from 'element-plus'
// 导入仓库实例
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 通知父组件修改场景
let $emit = defineEmits(['changeScene'])
//存储还未收集的销售属性的id和属性值的名字
let saleAttrIdAndName = ref<string>('')
// 存储全部品牌数据
let AllTraderMark = ref<any>([])
// 存储spu对应的图片数据
let imageList = ref<any[]>([])
// 存储全部销售属性
let saleAttr = ref<SallAttrList[]>([])
// 存储spu的销售属性
let allSaleAttr = ref<AllSallAttr[]>([])
// 存储已有的spu对象
let SpuParams = ref<SpuData>({
  spuName: '',
  description: '',
  category3Id: '',
  tmId: 0, //品牌id
  spuImageList: [],
  spuSaleAttrList: [],
})
// 存储预览图片的地址
let dialogImg = ref<string>()

// 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传成功前约束图片的类型和大小
  // 要求：文件格式：png|jpg|gif <4m
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    // 文件大小小于4m
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小必须小于4Mb',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
// 删除图片
const handleRemove = () => {}
// 照片墙预览按钮
const handlePictureCardPreview = (file: any) => {
  dialogImg.value = file.url
  // 弹出对话框
  dialogVisible.value = true
}

// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 取消添加，切换场景
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
// 计算当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部的销售属性：颜色、版本、尺码
  let unSelectArr = allSaleAttr.value.filter((item) => {
    //every数组方法的作用 判断数组中是否所有元素都满足条件
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
// 添加当前销售属性的方法
let addSaleAttr = () => {
  // baseSaleAttrId: number
  // saleAttrName: string
  // spuSaleAttrValueList: SallAttrValueList[]
  // split切割字符串
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器
  let newSaleAttr: SallAttrList = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空select
  saleAttrIdAndName.value = ''
}
// 添加当前销售属性值的方法
let addSaleAttrValue = (row: any) => {
  // 触发input的显示开关
  row.flag = true
  // 存储收集到的属性值的数据(主要包含属性值的id与属性名)
  //收集属性到目标的saleAttr数组单独的对象的中
  row.saleAttrValu = ''
}
//添加销售属性对象的失去焦点的事件
const toLook = (row: any, _$index: any) => {
  // 整理参数,解构数据,获取到属性值的请求数据
  const { baseSaleAttrId, saleAttrValu } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValu,
  }
  // 非法清空判断1:不能为空
  if (saleAttrValu.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    // 切换为查看模式
    row.flag = false
    return
  }
  // 非法清空判断2:不能为重复
  let repeat = row.spuSaleAttrValueList.find((item: any) => {
    return item.saleAttrValueName == saleAttrValu
  })
  if (repeat) {
    // 切换为查看模式
    row.flag = false
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 添加
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}
// 保存
const save = async () => {
  // 整理数据
  // 1.照片墙的数据  这里要根据服务器需要的字段改名
  SpuParams.value.spuImageList = imageList.value.map((item) => {
    return {
      imgName: item.name,
      // 如果是新增的话，则用图片远程地址
      // 修改的话则用已有的url
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2.整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  //发请求：添加/更新spu
  let result = await UpdateSpu(SpuParams.value)
  //成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景为0  flag为场景值,params为增加或修改
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    //失败
    ElMessage({
      type: 'error',
      message: '操作失败',
    })
    //  通知父组件切换场景为0
    $emit('changeScene', 0)
  }
}

// 向父组件暴露添加方法
const initAddSpuData = async (c3Id: number) => {
  // 清空数据
  saleAttrIdAndName.value = ''
  SpuParams.value.category3Id = ''
  SpuParams.value.spuName = ''
  SpuParams.value.description = ''
  SpuParams.value.spuImageList = []
  SpuParams.value.spuSaleAttrList = []
  saleAttr.value = []
  imageList.value = []
  SpuParams.value.tmId = ''

  // 存储三级分类的id
  SpuParams.value.category3Id = c3Id

  // 发送请求获取已有的品牌和属性数据
  let result: AllSallAttrResponse = await reqAllSallAttr()
  let result1: TradeMarkResponseData = await reqAllTraderMark()
  AllTraderMark.value = result1.data
  allSaleAttr.value = result.data
}

// 子组件书写修改方法,暴露给父组件
const initHasSpuData = async (row: SpuData) => {
  // 存储已有的spu对象
  SpuParams.value = row
  // 发送请求
  // 项目下全部的销售属性
  let result: AllSallAttrResponse = await reqAllSallAttr()
  // 获取全部品牌的数据
  let result1: TradeMarkResponseData = await reqAllTraderMark()
  // 全部的图片数据
  let result2: spuImageList = await reqAllImage(row.id as number)
  // spu下全部的销售属性
  let result3: SallAttrResponse = await reqSallAttr(row.id as number)
  AllTraderMark.value = result1.data
  imageList.value = result2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = result3.data
  allSaleAttr.value = result.data
}

// 当前组件销毁，清空仓库中的数据
onBeforeMount(() => {
  categoryStore.$reset()
})
// setup语法糖对于子组件的属性和方法默认是关闭的，需要对外暴露
defineExpose({ initHasSpuData, initAddSpuData })
</script>

<style scoped></style>

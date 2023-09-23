<template>
  <el-card>
    <!-- 表格 -->
    <el-table border style="margin: 10px 0px" :data="skuParams">
      <el-table-column
        width="80px"
        align="center"
        label="序号"
        type="index"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        show-overflow-tooltip
        width="200px"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="250px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="默认图片" width="250px">
        <template #="{ row }">
          <el-image
            :src="row.skuDefaultImg"
            lazy
            style="width: 100%; height: 150px"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量（g）"
        width="250px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格（元）"
        width="250px"
        prop="price"
      ></el-table-column>
      <el-table-column width="350px" label="操作" fixed="right">
        <template #="{ row }">
          <el-button
            :type="row.isSale ? 'success' : 'info'"
            :icon="row.isSale ? 'Top' : 'Bottom'"
            @click="changeFlag(row)"
            v-has="`btn.Sku.updown`"
          ></el-button>
          <el-button
            type="primary"
            icon="edit"
            @click="edit"
            v-has="`btn.Sku.update`"
          ></el-button>
          <el-button
            type="info"
            icon="message"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除这个商品吗？`"
            @confirm="deleteItem(row.id)"
            v-has="`btn.Sku.detail`"
          >
            <template #reference>
              <el-button type="danger" icon="delete"></el-button>
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
      @size-change="getSku"
      @current-change="getSku"
    />
    <!-- 抽屉组件
    v-model=显示与隐藏
    :direction=方向（默认从右到左）
    -->
    <el-drawer v-model="drawer" direction="rtl">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">
            <span style="line-height: 1.25em; letter-spacing: 0.01em">
              {{ skuInfo.skuName }}
            </span>
          </el-col>
        </el-row>
        <el-divider border-style="double" />
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>

          <el-col :span="18">
            <span style="line-height: 1.25em; letter-spacing: 0.01em">
              {{ skuInfo.skuDesc }}
            </span>
          </el-col>
        </el-row>
        <el-divider border-style="double" />
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}（元）</el-col>
        </el-row>
        <el-divider border-style="double" />
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-col :span="18">
              <el-tag
                style="margin: 5px"
                v-for="item in skuInfo.skuAttrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </el-col>
          </el-col>
        </el-row>
        <el-divider border-style="double" />
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-divider border-style="double" />
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-image
              :src="skuInfo.skuDefaultImg"
              lazy
              style="width: 110px; height: 110px"
              fit="contain"
            />
          </el-col>
        </el-row>
        <el-divider border-style="double" />
        <div class="swiper">
          <!-- 轮播图 -->
          <el-carousel :interval="4000" style="width: 100%; height: 300px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <el-image
                :src="item.imgUrl"
                style="width: 100%; height: 100%"
                fit="contain"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 引入请求地址
import {
  reqSkuGet,
  reqOnSale,
  reqCancelSale,
  reqGetSkuInfo,
  reqDeleteSku,
} from '@/API/product/sku/index'
// 引入ts类型
import { Record } from '@/API/product/sku/type'
import { ElMessage } from 'element-plus'

// 定义页数
let pageNo = ref<number>(1)
// 定义每页的条数
let pageSize = ref<number>(5)
// 总数
let total = ref()
// data里的record数据
let skuParams = ref<Record[]>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 储存数据
let skuInfo = ref<any>({})

onMounted(() => {
  getSku()
})
// 请求数据
const getSku = async (pager = 1) => {
  pageNo.value = pager
  // 发送请求
  let result: any = await reqSkuGet(pageNo.value, pageSize.value)
  // 存储数据
  skuParams.value = result.data.records
  total.value = result.data.total
}

// 上架与下架
const changeFlag = async (row: Record) => {
  //当前商品是上架状态，就下架
  if (row.isSale == 1) {
    // 发送请求 下架商品
    await reqCancelSale(row.id)
    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    // 更新数据
    getSku(pageNo.value)
  } else {
    // 发送请求 上架商品
    await reqOnSale(row.id)
    ElMessage({
      type: 'success',
      message: '上架成功',
    })
    // 更新数据
    getSku(pageNo.value)
  }
}
// edit
const edit = () => {
  ElMessage({
    type: 'success',
    message: '正在开发中。。。',
  })
}
// 查看详情数据
const findSku = async (sku: any) => {
  // 抽屉展示
  drawer.value = true
  // 获取已有的商品详情的数据
  let result: any = await reqGetSkuInfo(sku.id as number)
  skuInfo.value = result.data
}
// 删除某一个商品
const deleteItem = async (id: number) => {
  let result = await reqDeleteSku(id)
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
  getSku(skuParams.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
</script>

<style scoped>
.swiper {
  display: flex;
  justify-content: center;
}
</style>

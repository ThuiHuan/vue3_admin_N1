<template>
  <!-- 卡片视图 -->
  <el-card class="box-card">
    <!-- 卡片顶部的添加按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="addTradeMark"
      v-has="`btn.Trademark.add`"
    >
      添加品牌
    </el-button>
    <!-- 表格组件 -->
    <el-table
      border
      style="width: 100%; margin: 10px 0"
      center
      :data="tradermarkArr"
    >
      <el-table-column
        prop="date"
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column prop="tmName" label="品牌名称" align="left" />
      <el-table-column prop="address" label="品牌logo" align="left">
        <template #="{ row }">
          <el-image
            :src="row.logoUrl"
            lazy
            style="width: 100%; height: 150px"
            fit="contain"
          />
          <!-- <img :src="row.logoUrl" style="width: 150px; height: 150px" /> -->
        </template>
      </el-table-column>
      <el-table-column prop="address" label="品牌操作" align="left">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="edit"
            @click="updateTradeMark(row)"
            v-has="`btn.Trademark.update`"
          ></el-button>
          <!-- 气泡提示框
          @confirm：确认时触发
          @cancel：取消时触发
          -->
          <el-popconfirm
            :title="`你确定要删除${row.tmName}吗?`"
            width="250px"
            icon="Delete"
            @confirm="deleteTradeMark(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                icon="delete"
                v-has="`btn.Trademark.remove`"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器组件
      v-model:current-pag：设置分页器当前的页码
      v-model:page-size:设置每页展示数据的条数
      :page-sizes:下拉菜单的设置
      :small：是否使用小型分页器
      :background：是否给按钮背景颜色
      :disabled：是否不可选
      layout：可以设置分页器六个子组件布局调整
      :total：总数
      //自定义事件：
        @size-change="handleSizeChange":下拉菜单事件
        @current-change="handleCurrentChange"：页码改变事件
      -->
    <el-pagination
      @size-change="changeSize"
      @current-change="getHasTrademark"
      v-model:current-page="pagationNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="jumper, prev, pager, next, ->,sizes,total"
      :total="total"
      :pager-count="9"
    />
  </el-card>

  <!-- 对话框组件
  v-model:用于控制对话框的显示与隐藏
  title：设置左上角的标题
  -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="trademarkFroms"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- 上传文件 
          action:上传图片请求的url
          :on-success="handleAvatarSuccess" ：上传成功时触发的钩子，注入服务器返回的数据
          :before-upload="beforeAvatarUpload" ：上传前触发，注入上传的文件，若返回的Promist.reject则上传失败
          :show-file-list="false":是否显示文件列表
        -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入请求方法
import {
  reqHasTrademark,
  reqAddOrUpdateTradeMark,
  reqRemoveTrademark,
} from '@/API/product/trademark/index'
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入ts类型
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/API/product/trademark/type'
// 引入上传组件的ts类型
import { ElMessage, type UploadProps } from 'element-plus'
// 引入用户仓库

// 当前页码
let pagationNo = ref<number>(1)
// 每页展示多少条
let limit = ref<number>(3)
// 存储已有品牌总数
let total = ref<number>(0)
// 存储已有品牌的数据
let tradermarkArr = ref<Records>([])
//对话框的表单显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取表单元素
let trademarkFroms = ref()
// 品牌校验自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callback: any) => {
  //  自定义校验规则
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称位数大于等于两位。'))
  }
}
const validatorlogoUrl = (_rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传Logo图片'))
  }
}
// 定义表单校验规则
const rules = reactive({
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      trigger: 'change',
      validator: validatorlogoUrl,
    },
  ],
})

// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数
// 对于当前页码发生变化的自定义事件，组件pagination父组件回传的数据（当前的页码）
const getHasTrademark = async (pager: number = 1) => {
  pagationNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pagationNo.value + 2,
    limit.value,
  )
  if (result.code == 200) {
    // 更改总数
    total.value = result.data.total - 2 * limit.value
    // 收集返回的数据
    tradermarkArr.value = result.data.records
  }
}
// 组件挂载完毕的钩子
onMounted(() => {
  getHasTrademark()
})
// 下拉菜单发生变化的时候触发
// 这个自定义事件，分页器组件会将下拉菜单选中的数值返回给了limit
let changeSize = () => {
  // 页码归一
  pagationNo.value = 1
  getHasTrademark()
}
// 添加品牌
let addTradeMark = () => {
  // 清空收集的数据
  trademarkParams.id = 0
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  // 修改已有品牌按钮的回调
  dialogFormVisible.value = true
  // 清空校验结果
  // 第一种写法：
  // trademarkFroms.value?.clearValidate('tmName')
  // trademarkFroms.value?.clearValidate('logoUrl')
  // 第二种写法 使用nextTick
  nextTick(() => {
    trademarkFroms.value.clearValidate('tmName')
    trademarkFroms.value.clearValidate('logoUrl')
  })
}
// 品牌操作-修改事件
let updateTradeMark = (e: TradeMark) => {
  // Es6语法合并对象
  Object.assign(trademarkParams, e)
  // 修改已有品牌按钮的回调 展示对话框
  dialogFormVisible.value = true
  // 清空校验结果
  trademarkFroms.value?.clearValidate('tmName')
  trademarkFroms.value?.clearValidate('logoUrl')
}
// 品牌操作-删除事件
let deleteTradeMark = async (e: TradeMark) => {
  let result = await reqRemoveTrademark(e.id as number)
  if (result.code == 200) {
    // 提示
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasTrademark()
  } else {
    // 提示
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// dialog-取消按钮
let cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}
// dialog-确定按钮
let confirm = async () => {
  // 校验成功就发送请求 await可以阻塞代码
  await trademarkFroms.value.validate()
  // 发送请求
  let result = await reqAddOrUpdateTradeMark(trademarkParams)
  // 成功
  if (result.code == 200) {
    // 对话框隐藏
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改成功' : '上传成功',
    })
    // 更新数据
    getHasTrademark()
  }
  // 失败
  else {
    // 对话框隐藏
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改失败' : '上传失败',
    })
  }
  // 当前页码归1
  if (trademarkParams.id) {
    // 修改，留在当前页
    return true
  } else {
    // 页码归一，更新数据
    pagationNo.value = 1
    getHasTrademark()
  }
}
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
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  _uploadFile,
) => {
  // response是当前图片上传post请求服务器返回的数据
  // uploadFile是当前返回图片的信息
  trademarkParams.logoUrl = response.data
  // 图片上传成功则清楚校验结果
  trademarkFroms.value.clearValidate('logoUrl')
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

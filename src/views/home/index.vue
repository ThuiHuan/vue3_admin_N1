<template>
  <div>
    <el-card>
      <div>
        <img
          :src="userStore.avatar"
          alt=""
          style="
            width: 70px;
            height: 70px;
            border-radius: 50%;
            float: left;
            margin-right: 20px;
          "
        />
        <h1
          style="
            font-weight: 600;
            font-size: 22px;
            line-height: 70px;
            overflow: hidden;
          "
        >
          {{ time }}! {{ userStore.username }}
        </h1>
      </div>
    </el-card>
    <div style="display: flex; justify-content: center">
      <svg-icon name="welcome" width="600px" height="600px" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入时间
import { getTime } from '../../utils/times'
// 引入组合式API
import { onMounted } from 'vue'
// 引入用户仓库
import useUserStore from '@/store/modules/user'
// 存储时间
let time = getTime()
let userStore = useUserStore()
onMounted(() => {
  userStore.userInfo()
})
</script>

<style scoped></style>

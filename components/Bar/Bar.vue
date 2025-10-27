<template>
  <view class="bar">
    <view @click="goPage(1)" class="bar-item" :class="{ 'acitve': activeIndex === 1 }">
      <image v-if="activeIndex === 1" style="width: 35rpx;" src="../../static/bar-home-active.png" mode="widthFix"></image>
      <image v-if="activeIndex !== 1" style="width: 35rpx;" src="../../static/bar-home.png" mode="widthFix"></image>
    </view>
    <view @click="goPage(2)" class="bar-item" :class="{ 'acitve': activeIndex === 2 }">
      <image v-if="activeIndex === 2" style="width: 35rpx;" src="../../static/bar-serve-active.png" mode="widthFix"></image>
      <image v-if="activeIndex !== 2" style="width: 35rpx;" src="../../static/bar-serve.png" mode="widthFix"></image>
    </view>
    <view @click="goPage(3)" class="bar-item" :class="{ 'acitve': activeIndex === 3 }">
      <image v-if="activeIndex === 3" style="width: 44rpx;" src="../../static/bar-shop-active.png" mode="widthFix"></image>
      <image v-if="activeIndex !== 3" style="width: 44rpx;" src="../../static/bar-shop.png" mode="widthFix"></image>
    </view>
    <view @click="goPage(4)" class="bar-item" :class="{ 'acitve': activeIndex === 4 }">
      <image v-if="activeIndex === 4" style="width: 34rpx;" src="../../static/bar-me-active.png" mode="widthFix"></image>
      <image v-if="activeIndex !== 4" style="width: 34rpx;" src="../../static/bar-me.png" mode="widthFix"></image>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  actived: {
    type: Number,
    default: 0
  }
})
const activeIndex = ref(props.actived)
function goPage (index) {
  if (index === activeIndex.value) {
    return
  }
  if (index === 1) {
    uni.redirectTo({
      url: '/pages/index/index'
    })
  }
  if (index === 2) {
    uni.redirectTo({
      url: '/pages/chatList/chatList'
    })
  }
  if (index === 3) {
    uni.redirectTo({
      url: '/pages/shopping/shopping'
    })
  }
  if (index === 4) {
    uni.redirectTo({
      url: '/pages/mine/mine'
    })
  }
}
</script>
<style lang="scss">
.bar{
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;
  width: 586rpx;
  height: 130rpx;
  backdrop-filter: blur(30px);
  border-radius: 100rpx;
  margin: 0 auto;
  background: #00000080;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 9rpx;
  .bar-item{
    width: 110rpx;
    height: 110rpx;
    border-radius: 110rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    &.acitve{
      background-color: #FFFFFF;
    }
  }
}
</style> 
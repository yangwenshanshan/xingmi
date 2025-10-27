<template>
  <view class="TextMessage" :class="message.flow === 'out' ? 'self' : 'star'">
    {{ textInfo.text }}
  </view>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    default: () => {}
  },
  isMine: {
    type: Boolean,
    default: true
  }
})

const textInfo = computed(() => {
  if (props.message && props.message.payload) {
    return props.message.payload
  } else {
    return {
      text: ''
    }
  }
})
</script>
<style lang="scss" scoped>
.TextMessage {
  max-width: 552rpx;
  width: fit-content;
  box-sizing: border-box;
  padding: 20rpx;
}
.self{
  background: #FF92C1;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 8rpx;
  border-bottom-right-radius: 32rpx;
  border-bottom-left-radius: 32rpx;
}
.star{
  border-top-left-radius: 8rpx;
  border-top-right-radius: 32rpx;
  border-bottom-right-radius: 32rpx;
  border-bottom-left-radius: 32rpx;
  background: #FFFFFF99;
  backdrop-filter: blur(20rpx);
}
</style> 
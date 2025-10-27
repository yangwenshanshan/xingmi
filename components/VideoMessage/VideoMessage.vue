<template>
  <view class="video-message" @click="goVideoPlay">
    <!-- error="videoError" bindfullscreenchange="showVideoFullScreenChange"  bind:longpress="handleLongPress" -->
    <!-- <video class="video-box" :src="message.payload.videoUrl" :poster="message.payload.thumbUrl"></video> -->
    <!-- :style="`height:${videoInfo.thumbHeight}px; width: ${videoInfo.thumbWidth}px;`" -->
    <image
      class="image-message"
      mode="widthFix"
      :src="videoInfo.thumbUrl"
    />
    <view class="video-mask"></view>
    <image class="video-play" mode="widthFix" src="data:image/png;base64,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"></image>
  </view>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    default: () => {}
  },
})

const videoInfo = computed(() => {
  if (props.message && props.message.payload) {
    return props.message.payload
  } else {
    return {
      thumbUrl: ''
    }
  }
})

function goVideoPlay () {
  uni.navigateTo({
		url: '/pages/videoPlay/videoPlay?url=' + videoInfo.value.videoUrl
	})
}
</script>
<style lang="scss">
.video-message {
  max-width: 282rpx;
  position: relative;
  .image-message {
    max-width: 100%;
    border-radius: 24rpx;
    display: block;
  }
  .video-mask{
    position: absolute;
    background: rgba(0,0,0, 0.3);
    border-radius: 24rpx;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .video-play{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 88rpx;
  }
}
</style> 
<template>
  <view class="TUI-ImageMessage" @click="previewImage">
    <!-- :style="`height:${imageInfo.height}px; width: ${imageInfo.width}px;`" -->
    <image
      class="image-message"
      mode="widthFix"
      :src="imageInfo.url"
    />
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

const imageInfo = computed(() => {
  if (props.message && props.message.payload) {
    return props.message.payload.imageInfoArray[0]
  } else {
    return {
      height: 0,
      width: 0,
      url: ''
    }
  }
})

function previewImage() {
  uni.previewImage({
    urls: [imageInfo.value.url],
  });
}
</script>
<style lang="scss">
.TUI-ImageMessage {
  max-width: 282rpx;
  .image-message {
    max-width: 100%;
    border-radius: 24rpx;
  }
}
</style> 
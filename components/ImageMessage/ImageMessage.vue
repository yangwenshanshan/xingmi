<template>
  <view class="TUI-ImageMessage" @click="previewImage">
    <image
      class="image-message"
      mode="aspectFill"
      :src="imageInfo.url"
      :style="`height:${imageHeight}rpx; width: ${imageWidth}rpx;`"
    />
  </view>
</template>
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    default: () => {}
  },
})
const imageWidth = ref(282)
const imageHeight = computed(() => {
  if (imageInfo.value.width && imageInfo.value.height) {
    return `${imageInfo.value.height / imageInfo.value.width * imageWidth.value}`
  } else {
    return 400
  }
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
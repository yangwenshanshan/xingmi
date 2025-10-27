<template>
	<view class="videoplay">
    <video :src="url" autoplay></video>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const url = ref('')
onLoad((option) => {
  url.value = option.url
  console.log(option.url)
})
</script>

<style lang="scss">
.videoplay{
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  video{
    width: 100vw;
    height: 80vh;
  }
}
</style>

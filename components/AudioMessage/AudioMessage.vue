<template>
  <view v-if="canPlay" class="TextMessage" :class="message.flow === 'out' ? 'self' : 'star'" @click="playAudio">
    <view class="message-item" v-if="message.flow === 'out'">
      <view style="margin-right: 10rpx;display: flex;align-items: center;">{{ second }}''</view>
      <view class="voice__play__icon__container" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
    </view>
    <view class="message-item" v-if="message.flow === 'in'">
      <view class="voice__play__icon__container" style="transform: rotate(180deg);" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
      <view style="margin-left: 10rpx;display: flex;align-items: center;">{{ second }}''</view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    default: () => {}
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['playAudio'])
const canPlay = ref(false)
let innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.onCanplay(() => {
	canPlay.value = true
  second.value = parseInt(innerAudioContext.duration)
})
onMounted(() => {
  if (props.message && props.message.payload) {
    innerAudioContext.src = props.message.payload.url;
  }
})
const second = ref('')
function playAudio () {
  emit('playAudio')
}
</script>
<style lang="scss" scoped>
.TextMessage {
  max-width: 552rpx;
  width: fit-content;
  box-sizing: border-box;
  padding: 20rpx;
  display: flex;
  align-items: center;
  .message-item{
    display: flex;
    align-items: center;
  }
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
.web_wechat_voice_playing {
  animation: voicePlaying 1s infinite forwards
}
.voice__play__icon__container {
  background: url(https://res.wx.qq.com/t/fed_upload/7e4688e4-d39b-421b-8f04-27fdb397d4ee/icon__voice.svg) no-repeat 100%;
  display: block;
  flex-shrink: 0;
  height: 22px;
  margin-left: 4px;
  width: 22px
}
@keyframes voicePlaying {
  0% {
    background-position: 0
  }

  33% {
    background-position: 0
  }

  33.33% {
    background-position: 50%
  }

  66% {
    background-position: 50%
  }

  66.66% {
    background-position: 100%
  }

  99.99% {
    background-position: 100%
  }

  to {
    background-position: 0
  }
}
</style> 
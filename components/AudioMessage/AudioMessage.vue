<template>
  <view class="message-main" :class="message.flow === 'out' ? 'parent-self' : 'parent-star'">
    <view class="TextMessage" :class="message.flow === 'out' ? 'self' : 'star'" :style="`width: ${second / 60 * 552}rpx`" @longpress="audioLongpress">
      <view class="message-item" v-if="message.flow === 'out'" @click="playAudio">
        <view style="margin-right: 10rpx;display: flex;align-items: center;">{{ second }}''</view>
        <view class="voice__play__icon__container" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
      </view>
      <view class="message-item" v-if="message.flow === 'in'" @click="playAudio">
        <view class="voice__play__icon__container" style="transform: rotate(180deg);" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
        <view style="margin-left: 10rpx;display: flex;align-items: center;">{{ second }}''</view>
      </view>
      <view v-if="audio2TextVisible" class="audio-to-text">
        <image src="/static/audio-to-text.png" mode="widthFix" @click="audio2Text"></image>
      </view>
    </view>
    <view class="text-main" v-if="textMessageVisible">
      <TextMessage style="margin-top: 11rpx;" :message="textMessage" @longpress="textLongpress"></TextMessage>
      <view v-if="textCloseVisible" class="audio-to-text">
        <image src="/static/text-close.png" mode="widthFix" @click="textClose"></image>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'

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
const textCloseVisible = ref(false)
const textMessageVisible = ref(false)
const textMessage = computed(() => {
  return {
    type: 'TIMTextElem',
    flow: props.message.flow,
    payload: {
      text: props.message.text_content
    }
  }
})

const emit = defineEmits(['playAudio'])
const audio2TextVisible = ref(false)
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
const second = ref('0')
function playAudio () {
  emit('playAudio', canPlay.value)
}
function audioLongpress (e, a) {
  if (textMessageVisible.value) {
    return
  }
  audio2TextVisible.value = true
}
function textLongpress () {
  textCloseVisible.value = true
}
function audio2Text () {
  textMessageVisible.value = true
  audio2TextVisible.value = false
}
function textClose () {
  textMessageVisible.value = false
  audio2TextVisible.value = false
  textCloseVisible.value = false
}
</script>
<style lang="scss" scoped>
.message-main{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.parent-self{
  align-items: flex-end;
}
.parent-star{
  align-items: flex-start;
}
.text-main{
  position: relative;
}
.TextMessage {
  max-width: 552rpx;
  width: fit-content;
  box-sizing: border-box;
  padding: 20rpx;
  min-height: 84rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-width: 140rpx;
  position: relative;
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
  justify-content: flex-end;
}
.star{
  border-top-left-radius: 8rpx;
  border-top-right-radius: 32rpx;
  border-bottom-right-radius: 32rpx;
  border-bottom-left-radius: 32rpx;
  background: #FFFFFF99;
  backdrop-filter: blur(20rpx);
  justify-content: flex-start;
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
.audio-to-text{
  width: 119rpx;
  height: 118rpx;
  position: absolute;
  top: -118rpx;
  left: 0;
  right: 0;
  margin: auto;
  image{
	  width: 100%;
  }
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
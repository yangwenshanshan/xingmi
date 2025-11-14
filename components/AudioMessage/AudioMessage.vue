<template>
  <view class="message-main" :class="message.flow === 'out' ? 'parent-self' : 'parent-star'">
    <view @click="playAudio" class="TextMessage" :class="message.flow === 'out' ? 'self' : 'star'" :style="`width: ${ 120 + (message.second / 60 * 432)}rpx`" @longpress="audioLongpress">
      <view class="message-item" v-if="message.flow === 'out'">
        <view style="margin-right: 0rpx;display: flex;align-items: center;">{{ message.second }}''</view>
        <view class="voice__play__icon__container" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
      </view>
      <view class="message-item" v-if="message.flow === 'in'">
        <view class="voice__play__icon__container" style="transform: rotate(180deg);" :class="{ 'web_wechat_voice_playing': isPlaying }"></view>
        <view style="margin-left: 0rpx;display: flex;align-items: center;">{{ message.second }}''</view>
      </view>
      <view v-if="audio2TextVisible" class="audio-to-text">
        <image src="/static/audio-to-text.png" mode="widthFix" @click.stop="audio2Text"></image>
      </view>
    </view>
    <view class="text-main" v-if="textMessageVisible">
      <TextMessage style="margin-top: 11rpx;" :message="textMessage" @longpress="textLongpress">
        <view v-if="message.text_content">
          {{ message.text_content }}
        </view>
        <view v-else style="display: flex;align-items: center;">
          <image style="width: 44rpx;height: 44rpx;" mode="widthFix" src="../../static/loading.gif"></image>
        </view>
      </TextMessage>
      <view v-if="textCloseVisible" class="audio-to-text">
        <image src="/static/text-close.png" mode="widthFix" @click.stop="textClose"></image>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import http from '../../utils/http'

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
const message = ref({ ...props.message })
const textCloseVisible = ref(false)
const textMessageVisible = ref(false)
const textMessage = computed(() => {
  return {
    type: 'TIMTextElem',
    flow: message.value.flow,
  }
})

const emit = defineEmits(['playAudio', 'press'])
const audio2TextVisible = ref(false)
if (message.value && !message.value.second && message.value.payload) {
  message.value.second = 0
  let innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = message.value.payload.url;
  innerAudioContext.onCanplay(() => {
    message.value.second = parseInt(innerAudioContext.duration)
  })
}
function playAudio () {
  emit('playAudio')
}
function audioLongpress () {
  if (textMessageVisible.value) {
    emit('press')
    textLongpress()
    return
  } else {
    emit('press')
    audio2TextVisible.value = true
  }
}
function textLongpress () {
  textCloseVisible.value = true
}
function audio2Text () {
  textMessageVisible.value = true
  audio2TextVisible.value = false
  if (message.value && !message.value.id && message.value.ID) {
    getChatTextFive(message.value.ID).then(data => {
      if (data) {
        message.value.text_content = data.text_content
      } else {
        message.value.text_content = '转换失败'
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}
function textClose () {
  textMessageVisible.value = false
  audio2TextVisible.value = false
  textCloseVisible.value = false
}
function closeTip () {
  audio2TextVisible.value = false
  textCloseVisible.value = false
}
async function getChatTextFive (messageId) {
  let attempts = 0;
  while (attempts < 5) {
    const result = await getChatText(messageId);
    if (result && result.length > 0) {
      return result[0];
    }
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return false;
}
function getChatText (messageId) {
  return new Promise((resolve, reject) => {
    http.get('/items/chat_messages', {
      fields: [
        '*'
      ],
      filter: {
        tencent_im_message_id: {
				  '_eq': messageId
        }
      }
    }).then(res => {
      resolve(res.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
defineExpose({
  closeTip
})
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
  min-width: 120rpx;
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
  background: url('../../static/rgcyi-kjfua.png') no-repeat 100%;
  display: block;
  flex-shrink: 0;
  height: 44rpx;
  // margin-left: 4px;
  width: 44rpx
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
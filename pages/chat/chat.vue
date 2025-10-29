<template>
	<view class="chat" :style="`height: calc(100vh - ${changeBottomVal});${backgroundImage ? `background-image: url(${backgroundImage});` : ''}`">
    <view class="status_bar"></view>
    <view class="chat-star">
      <view class="star-back" @click="goBack">
        <image style="width: 14rpx;" mode="widthFix" src="../../static/bar-back.png"></image>
      </view>
      <StarInfo v-if="detail" :icon="detail.user.avatar" :name="detail.name " :desc="detail.desc"></StarInfo>
    </view>
    <scroll-view @touchstart="onTouchstartScrollView" class="info-list" scroll-y :style="`height: ${scrollViewHeight}`" :scroll-top="scrollTop">
      <view id="content">
        <view class="list-item" v-for="item in msgList" :class="item.flow === 'out' ? 'self-parent' : 'star-parent'">
          <TextMessage v-if="item.type === 'TIMTextElem'" :message="item"></TextMessage>
          <ImageMessage v-if="item.type === 'TIMImageElem'" :message="item"></ImageMessage>
          <VideoMessage v-if="item.type === 'TIMVideoFileElem'" :message="item"></VideoMessage>
          <AudioMessage :isPlaying="item.isPlaying" @playAudio="(flag) => playAudio(item, flag)" v-if="item.type === 'TIMSoundElem'" :message="item"></AudioMessage>
        </view>
      </view>
    </scroll-view>
    <view class="chat-bottom-holder" :class="{ 'logpress-chat-bottom-holder': longPressing }" :style="longPressing ? `height: 908rpx;bottom:${changeBottomVal}` : `height: ${bottomHeight};bottom:${changeBottomVal}`"></view>
    <view class="chat-bottom" :style="`height: ${bottomHeight};bottom:${changeBottomVal}`">
      <view v-if="!longPressing" class="bottom-tip" :class="{ 'linear-transition': optListTransition }" :style="moreOpen ? 'top: 74rpx;' : 'top: 148rpx'">
        <image class="tip-image" src="../../static/card-small-1.png" mode="heightFix" @click="goCard"></image>
        <view class="image-parent">
          <image class="tip-image" src="../../static/card-small-2.png" mode="heightFix"></image>
          <image class="tip-image-tip" src="../../static/expectations.png" mode="heightFix"></image>
        </view>
        <image class="tip-image" src="../../static/card-small-3.png" mode="heightFix" @click="giftVisible = true"></image>
      </view>
      <view  class="opt-list" :class="{ 'linear-transition': optListTransition }" :style="moreOpen && inputVisible && !longPressing ? 'bottom: 100rpx' : 'bottom: -200rpx'">
        <view class="opt-item" @click="sendMsgImage"> 
          <image src="../../static/card-pic.png" mode="heightFix"></image>
          <view>图片</view>
        </view>
        <view class="opt-item" @click="sendMsgVideo">
          <image src="../../static/card-photo.png" mode="heightFix"></image>
          <view>拍摄</view>
        </view>
        <view class="opt-item" @click="showAudio">
          <image src="../../static/card-phone.png" mode="heightFix"></image>
          <view>语音</view>
        </view>
        <view class="opt-item" @click="goVideo">
          <image src="../../static/card-video.png" mode="heightFix"></image>
          <view>视频</view>
        </view>
      </view>
      <view class="opt-gift" v-if="giftVisible && !longPressing" @click="giftVisible = false">
        <image src="../../static/gift.png" mode="widthFix" class="gift-image"></image>
      </view>
      <view class="bottom-input" :class="{ 'bottom-input-pressing': longPressing, 'linear-transition': optListTransition }" :style="moreOpen ? 'bottom: 312rpx' : 'bottom: 80rpx'">
        <template v-if="!longPressing">
          <image @click="inputVisibleClick(false)" v-if="inputVisible" class="input-image" src="../../static/chat-audio.png"></image>
          <image @click="inputVisibleClick(true)" v-else class="input-image" src="../../static/chat-input.png"></image>
        </template>
        <view class="input-main">
          <input
            :adjust-position="false"
            @keyboardheightchange="keyboardheightchange"
            @focus="inputFocus"
            v-model="inputValue"
            @confirm="sendMessage"
            :cursor-spacing="0"
            v-if="inputVisible"
            confirm-type="send"
            placeholder="发消息..."
            placeholder-style="color: #ffffff"
          ></input>
          <view :class="longPressing ? 'long-pressing' : ''" @touchcancel="handleTouchCancel" @touchstart="handleTouchStart" @touchend="handleTouchEnd" class="main-speak" v-else>
            <template v-if="!longPressing">按住说话</template>
            <view v-else class="speaking">
              <view class="speak-loading">
                <image mode="widthFix" style="width: 298rpx;" src="../../static/chat-calling.gif"></image>
              </view>
              <view class="loading-text">松开发送 上滑取消</view>
              <view class="loading-bottom" id="loadingSpeak">
                <image style="width: 46rpx;" mode="widthFix" src="../../static/chat-speaking.png"></image>
              </view>
            </view>
          </view>
        </view>
        <template v-if="!longPressing">
          <image v-if="!moreOpen" class="input-image" src="../../static/chat-more.png" @click="moreOpenClick(true)"></image>
          <image v-else class="input-image" src="../../static/chat-more-open.png" @click="moreOpenClick(false)"></image>
        </template>
      </view>
    </view>
	</view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { computed, ref, nextTick } from 'vue'
import { tim, timEvent } from '../../utils/tim'
import http from '../../utils/http';
import { getImage } from '../../utils/util';

let recorderManager = null
// #ifndef H5
recorderManager = uni.getRecorderManager();
recorderManager.onStop((res) => {
  if (canSendAudio.value) {
    let message = tim.createAudioMessage({
      to: starId.value,
      conversationType: 'C2C',
      payload: {
        file: res
      },
      onProgress: function(event) {
        console.log(event)
      }
    })
    tim.sendMessage(message).then(response => {
      msgList.value.push(response.data.message)
      scrollBottom()
    })
  }
});
// #endif
let innerAudioContext = null
const canSendAudio = ref(false)
const optListTransition = ref(false)
const starId = ref('')
const chatId = ref('')
const msgList = ref([])
const inputValue = ref('')
const giftVisible = ref(false)
const inputVisible = ref(true)
const moreOpen = ref(false)
const scrollTop = ref(0)
const longPressing = ref(false)
const detail = ref(null)
const changeBottomVal = ref('0px')
const bottomHeight = computed(() => {
  if (moreOpen.value) {
    return '553rpx'
  } else {
    return '395rpx'
  }
})
const scrollViewHeight = computed(() => {
  return `calc(100vh - 116rpx - var(--status-bar-height) - ${changeBottomVal.value} - ${bottomHeight.value})`
})
const backgroundImage = computed(() => {
  if (detail.value && detail.value.background_images && detail.value.background_images.length) {
    const id = detail.value.background_images[0].directus_files_id
    return getImage(id)
  } else {
    return ''
  }
})

onLoad((option) => {
  starId.value = option.idol
  chatId.value = option.chat
  if (chatId.value) {
    getListMsg()
  }
  tim.on(timEvent.MESSAGE_RECEIVED, onMessageReceived);
  getDetail()
})
onUnload(() => {
  if (innerAudioContext) {
    innerAudioContext.stop()
    innerAudioContext.destroy()
    innerAudioContext = null
  }
  tim.off(timEvent.MESSAGE_RECEIVED, onMessageReceived);
})
function playAudio (item, flag) {
  if (!flag) {
     uni.showToast({
      icon: 'none',
      title: '音频加载中，请稍后',
    });
    return
  }
  const playing = item.isPlaying
  msgList.value.forEach(el => {
    if (el.type === 'TIMSoundElem') {
      el.isPlaying = false
    }
  })
  if (playing) {
    innerAudioContext.stop()
    innerAudioContext.destroy()
    innerAudioContext = null
    item.isPlaying = false
  } else {
    innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.onEnded(() => {
      item.isPlaying = false
    })
    innerAudioContext.src = item.payload.url
    innerAudioContext.play()
    item.isPlaying = true
  }
}
function getDetail() {
	http.get('/items/idol/' + starId.value, {
		fields: [
			'*',
			'user.avatar',
      'background_images.*'
		]
	}).then(res => {
		detail.value = res.data
	})
}
function onMessageReceived (event) {
  let arr = event.data.filter((res) => res.conversationID === `C2C${starId.value}`)
  msgList.value.push(...arr)
  scrollBottom()
}
function handleTouchCancel () {
  canSendAudio.value = false
  recorderManager && recorderManager.stop();
  longPressing.value = false
}
function handleTouchStart() {
  canSendAudio.value = false
  recorderManager && recorderManager.start();
  longPressing.value = true
}
function handleTouchEnd(e) {
  if (e && e.changedTouches.length) {
    const query = uni.createSelectorQuery()
    query.select('#loadingSpeak').boundingClientRect((rect) => {
      recorderManager && recorderManager.stop();
      longPressing.value = false

      const touch = e.changedTouches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      const elemTop = rect.top;
      const elemBottom = rect.bottom;
      const elemLeft = rect.left;
      const elemRight = rect.right;
      if (touchX >= elemLeft && touchX <= elemRight && touchY >= elemTop && touchY <= elemBottom) {
        canSendAudio.value = true
      } else {
        canSendAudio.value = false
      }
    }).exec()
  }
}
function onTouchstartScrollView () {
  uni.hideKeyboard()
  moreOpen.value = false
  optListTransition.value = true
  setTimeout(() => {
    optListTransition.value = false
  }, 100);
}
function scrollBottom () {
  nextTick(() => {
    nextTick(() => {
      const query = uni.createSelectorQuery()
      query.select('#content').boundingClientRect((res) => {
        if (scrollTop.value === res.height) {
          scrollTop.value++
        } else {
          scrollTop.value = res.height
        }
      }).exec()
    })
  })
}
function keyboardheightchange(e) {
  if (e.detail.height > 20) {
    changeBottomVal.value = `calc(${e.detail.height + 'px'} - 70rpx)`
  } else {
    changeBottomVal.value = `${e.detail.height + 'px'}`
  }
  
  scrollBottom()
}
function getListMsg () {
  http.get(`/items/chat/${chatId.value}`, {
    fields: ['id', 'messages.*'],
    deep: {
      messages: {
        _limit: 1000,
        _sort: ['date_created'],
      }
    },
  }).then(res => {
    const messages = res.data.messages
    messages.forEach(element => {
      element.flow = element.role === 'user' ? 'out' : 'in'
      if (element.content_type === 'text') {
        element.type = 'TIMTextElem'
        element.payload = {
          text: element.text_content
        }
      }
      if (element.content_type === 'video') {
        element.type = 'TIMVideoFileElem'
        element.payload = {
          thumbUrl: '',
          videoUrl: getImage(element.asset),
        }
      }
      if (element.content_type === 'image') {
        element.type = 'TIMImageElem'
        element.payload = {
          imageInfoArray: [{
            url: getImage(element.asset),
          }]
        }
      }
      if (element.content_type === 'audio') {
        element.type = 'TIMSoundElem'
        element.payload = {
          url: getImage(element.asset),
        }
      }
    });
    msgList.value = messages
    scrollBottom()
  })
  // tim.getMessageList({
  //   conversationID: `C2C${starId.value}`
  // }).then(res => {
  //   msgList.value = [ ...res.data.messageList ]
  //   console.log(res.data.messageList)
  //   scrollBottom()
  // })
}
function inputFocus () {
  inputVisible.value = true
  moreOpen.value = false
}
function inputVisibleClick (flag) {
  inputVisible.value = flag
  if (flag === false) {
    moreOpen.value = false
  }
}
function moreOpenClick (flag) {
  optListTransition.value = true
  moreOpen.value = flag
  if (flag === true) {
    inputVisible.value = true
  }
  scrollBottom()
  optListTransition.value = true
  setTimeout(() => {
    optListTransition.value = false
  }, 100);
}
function sendMessage () {
  if (inputValue.value) {
    let message = tim.createTextMessage({
      to: starId.value,
      conversationType: 'C2C',
      payload: { text: inputValue.value }
    });
    tim.sendMessage(message).then(res => {
      msgList.value.push(res.data.message)
      scrollBottom()
    })
    inputValue.value = ''
  }
}
function sendMsgImage () {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    sizeType: ['original', 'compressed'],
    success: (res) => {
      console.log(res)
      let message = tim.createImageMessage({
        to: starId.value,
        conversationType: 'C2C',
        payload: {
          file: res
        },
        onProgress: function(event) {}
      });
      tim.sendMessage(message).then((res) => {
        msgList.value.push(res.data.message)
        scrollBottom()
      })
    }
  })
}
function sendMsgVideo () {
  uni.chooseVideo({
    sourceType: ['camera'],
    maxDuration: 60,
    success: (res) => {
      uni.compressVideo({
        src: res.tempFilePath,
        quality: 'high',
        success: (res) => {
          let message = tim.createVideoMessage({
            to: starId.value,
            conversationType: 'C2C',
            payload: {
              file: res
            },
            onProgress: function(event) {}
          });
          tim.sendMessage(message).then((res) => {
            msgList.value.push(res.data.message)
            scrollBottom()
          })
        }
      })
    }
  })
}
function showAudio () {
  uni.navigateTo({
		url: '/pages/calling/calling'
	})
}
function goBack () {
	uni.navigateBack()
}
function goVideo () {
  uni.showToast({
    icon: 'none',
    title: '敬请期待',
  });
}
function goCard () {
  uni.navigateTo({
		url: '/pages/card/card'
	})
}
</script>

<style lang="scss">
.chat{
  width: 100vw;
  background-image: url('../../static/chat-bg.png');
  background-size: 100% auto;
  position: relative;
  overflow: hidden;

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .chat-star{
    margin: 17rpx 0;
    display: flex;
    .star-back{
      padding: 20rpx;
      margin-left: 10rpx;
      margin-right: 8rpx;
    }
  }

  .info-list{
    width: 100vw;
    // transition: all 0.1s linear;
    .list-item{
      display: flex;
      width: 100vw;
      padding: 0 30rpx;
      box-sizing: border-box;
      margin-bottom: 33rpx;
    }
    .star-parent{
      justify-content: flex-start;
    }
    .self-parent{
      justify-content: flex-end;
    }
  }
  .chat-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    // transition: all 0.1s linear;
    .bottom-tip{
      position: absolute;
      top: 0rpx;
      left: 0;
      padding-left: 20rpx;
      width: 100%;
      box-sizing: border-box;
      height: 60rpx;
      display: flex;
      // transition: all 0.1s linear;
      .tip-image{
        height: 50rpx;
        margin-right: 25rpx;
      }
      .image-parent{
        position: relative;
        .tip-image-tip{
          height: 58rpx;
          position: absolute;
          top: -60rpx;
          left: 52rpx;
        }
      }
    }
    .opt-list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 33rpx;
      position: absolute;
      bottom: 100rpx;
      width: 100%;
      left: 0;
      .opt-item{
        font-size: 24rpx;
        color: #E0E0E0;
        text-align: center;
        image{
          width: 128prx;
          height: 128rpx;
        }
      }
    }
    .opt-gift{
      position: absolute;
      width: 100vw;
      height: 100vh;
      left: 0;
      bottom: 0;
      z-index: 3;
      .gift-image{
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }
    }
    .bottom-input{
      // transition: bottom 0.1s linear;
      position: absolute;
      width: calc(100% - 40rpx);
      bottom: 0;
      left: 0;
      height: 97rpx;
      border-radius: 100rpx;
      background: #DEC3C980;
      backdrop-filter: blur(30rpx);
      display: flex;
      align-items: center;
      margin: 0 20rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      .input-image{
        width: 56rpx;
        height: 56rpx;
      }
      .input-main{
        flex: 1;
        margin: 0 20rpx;
        font-size: 26rpx;
        text-align: center;
        color: #ffffff;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        input{
          width: 100%;
          color: #ffffff;
          font-size: 26rpx;
          text-align: left;
        }
        .main-speak{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .long-pressing{
          position: fixed;
          bottom: -80rpx;
          left: -20rpx;
          width: 100vw;
          height: 100vh;
          z-index: 50;
          .speaking{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 908rpx;
            .speak-loading{
              width: 508rpx;
              height: 137rpx;
              border-radius: 44rpx;
              background: #DEC3C980;
              backdrop-filter: blur(30px);
              margin: 175px auto 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .loading-text{
              color: #BBBBBB;
              font-size: 26rpx;
              font-weight: bold;
              margin-top: 33rpx;
            }
            .loading-bottom{
              width: 100%;
              height: 628rpx;
              padding-top: 57rpx;
              box-sizing: border-box;
              background: url('../../static/speaking-bg.png') center top no-repeat;
              background-size: 100% auto;
              margin-top: 92rpx;
            }
          }
        }
      }
    }
    .bottom-input-pressing{
      background: transparent;
      backdrop-filter: blur(0rpx);
    }
  }
  .chat-bottom-holder{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(2.56deg, rgba(45, 0, 27, 0.5) 47.8%, rgba(84, 29, 62, 0) 98.81%);
    backdrop-filter: blur(20px);
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%);
    box-sizing: border-box;
    // transition: all 0.1s linear;
  }
  .logpress-chat-bottom-holder{
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .linear-transition{
    transition: all 0.1s linear;
  }
}
</style>

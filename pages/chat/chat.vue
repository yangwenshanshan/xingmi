<template>
  <view class="chat-main">
    <view class="chat" :style="`height: calc(100vh - ${changeBottomVal});${backgroundImage ? `background-image: url(${backgroundImage});` : ''}`">
      <view class="top-mask" :style="`height: ${topMaskHeight};${backgroundImage ? `background-image: url(${backgroundImage});` : ''}`"></view>
      <view class="top-tip">提示：对话均由AI生成</view>
      <view class="status_bar"></view>
      <view class="chat-star">
        <view class="star-back" @click="goBack">
          <image style="width: 14rpx;" mode="widthFix" src="../../static/bar-back.png"></image>
        </view>
        <StarInfo v-if="detail" :icon="detail.user.avatar" :name="detail.name " :desc="detail.desc"></StarInfo>
      </view>
      <scroll-view class="info-list" scroll-y :style="`height: ${scrollViewHeight}`" :scroll-top="scrollTop">
        <view id="content" @touchmove="onTouchmoveScrollView" @touchstart="onTouchstartScrollView" :style="`padding-top: ${topMaskHeight};`">
          <view class="list-item" v-for="item in msgList" :class="item.flow === 'out' ? 'self-parent' : 'star-parent'">
            <view v-if="item.loading">
              <image style="width: 50rpx;" mode="widthFix" src="/static/message-loading.gif"></image>
            </view>
            <TextMessage v-if="item.type === 'TIMTextElem'" :message="item"></TextMessage>
            <ImageMessage v-if="item.type === 'TIMImageElem'" :message="item"></ImageMessage>
            <VideoMessage v-if="item.type === 'TIMVideoFileElem'" :message="item"></VideoMessage>
            <AudioMessage ref="audioMessage" @press="audioPress" :isPlaying="item.isPlaying" @playAudio="playAudio(item)" v-if="item.type === 'TIMSoundElem'" :message="item"></AudioMessage>
          </view>
          <!-- <view>
            <c-lottie :data="idolLoading" width="200rpx" height='100rpx' :loop="true"></c-lottie>
          </view> -->
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
          <image class="tip-image" src="../../static/card-small-3.png" mode="heightFix" @click="giftShow(true)"></image>
        </view>
        <view class="opt-list" :class="{ 'linear-transition': optListTransition }" :style="moreOpen && inputVisible && !longPressing ? 'bottom: 100rpx' : 'bottom: -200rpx'">
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
        <view class="opt-gift" v-if="giftVisible && !longPressing" @click="giftShow(false)">
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
    <view class="chat-mask" v-if="maskShow" @touchstart="maskTouch"></view>
  </view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { computed, ref, nextTick } from 'vue'
import { tim, timEvent } from '../../utils/tim'
import http from '../../utils/http';
import { getImage } from '../../utils/util';
// import idolLoading from "../../static/lottie/idol-loading.json";

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
    message.loading = true
    msgList.value.push(message)
    scrollBottom()
    tim.sendMessage(message).then(response => {
      const index = msgList.value.findIndex(el => el.ID === message.ID)
      const rmessage = {
          ...response.data.message,
          loading: false
        }
      msgList.value.splice(index, 1, rmessage)
    })
  }
});
// #endif
let innerAudioContext = null
const audioVisible = ref(false)
const audioMessage = ref(null)
const isScrollToTop = ref(false)
const topMaskHeight = computed(() => {
  if (isScrollToTop.value) {
    return '187rpx'
  }
  if (moreOpen.value) {
    return '390rpx'
  }
  if (maskShow.value) {
    return '150rpx'
  }
  return '566rpx'
})
const touchStartY = ref(0)
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
const maskShow = ref(false)
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
function maskTouch () {
  uni.hideKeyboard()
  maskShow.value = false
}
function playAudio (item) {
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
    if (innerAudioContext) {
      innerAudioContext.stop()
      innerAudioContext.destroy()
      innerAudioContext = null
    }
    innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.onEnded(() => {
      item.isPlaying = false
    })
    innerAudioContext.onError(() => {
      item.isPlaying = false
      uni.showToast({
        icon: 'none',
        title: '未知错误',
      });
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
  console.log(arr)
  http.get('/items/chat_messages', {
    fields: [ 'id' ],
    filter: {
      tencent_im_message_id: {
        '_in': arr.map(el => el.ID)
      }
    }
  }).then(res => {
    if (res && res.data && res.data.length) {
      http.patch('/items/chat_messages', {
        data: {
          is_read: true
        },
        keys: res.data.map(el => el.id)
      })
    }
  })
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
function onTouchmoveScrollView (e) {
  audioMaskTouch()
  if (!isScrollToTop.value && e && e.changedTouches.length) {
    const touch = e.changedTouches[0];
    if (touchStartY.value - touch.clientY < -20) {
      isScrollToTop.value = true
    }
  }
}
function onTouchstartScrollView (e) {
  if (!isScrollToTop.value && e && e.changedTouches.length) {
    const touch = e.changedTouches[0];
    touchStartY.value = touch.clientY;
  }
  uni.hideKeyboard()
  moreOpen.value = false
  optListTransition.value = true
  setTimeout(() => {
    optListTransition.value = false
  }, 100);
}
function scrollBottom () {
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    query.select('#content').boundingClientRect((res) => {
      if (scrollTop.value === res.height) {
        scrollTop.value++
      } else {
        scrollTop.value = res.height
      }
    }).exec()
  }, 100);
}
function keyboardheightchange(e) {
  if (e.detail.height > 20) {
    maskShow.value = true
    changeBottomVal.value = `calc(${e.detail.height + 'px'} - 70rpx)`
  } else {
    maskShow.value = false
    changeBottomVal.value = `${e.detail.height + 'px'}`
  }
  
  scrollBottom()
}
function getListMsg () {
  http.get(`/items/chat/${chatId.value}`, {
    fields: ['id', 'messages.*', 'messages.asset_metadata.*'],
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
        if (element.asset_metadata) {
          element.payload = {
            thumbUrl: getImage(element.asset_metadata.thumbnail),
            thumbWidth: element.asset_metadata && element.asset_metadata.width,
            thumbHeight: element.asset_metadata && element.asset_metadata.height,
            videoUrl: getImage(element.asset),
          }
        } else {
          element.payload = {
            videoUrl: getImage(element.asset),
          }
        }
      }
      if (element.content_type === 'image') {
        element.type = 'TIMImageElem'
        element.payload = {
          imageInfoArray: [{
            width: element.asset_metadata && element.asset_metadata.width,
            height: element.asset_metadata && element.asset_metadata.height,
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
  audioMaskTouch()
  inputVisible.value = flag
  if (flag === false) {
    moreOpen.value = false
  }
}
function giftShow(flag) {
  audioMaskTouch()
  giftVisible.value = flag
}
function moreOpenClick (flag) {
  audioMaskTouch()
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
    message.loading = true
    msgList.value.push(message)
    scrollBottom()
    tim.sendMessage(message).then(res => {
      const index = msgList.value.findIndex(el => el.ID === message.ID)
      const rmessage = {
        ...res.data.message,
        loading: false
      }
      msgList.value.splice(index, 1, rmessage)
    })
    inputValue.value = ''
  }
}
function sendMsgImage () {
  audioMaskTouch()
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
      message.loading = true
      msgList.value.push(message)
      scrollBottom()
      tim.sendMessage(message).then((res) => {
        const index = msgList.value.findIndex(el => el.ID === message.ID)
        const rmessage = {
          ...res.data.message,
          loading: false
        }
        msgList.value.splice(index, 1, rmessage)
      })
    }
  })
}
function sendMsgVideo () {
  audioMaskTouch()
  uni.chooseVideo({
    sourceType: ['camera'],
    maxDuration: 60,
    compressed: false,
    success: (res) => {
      let message = tim.createVideoMessage({
        to: starId.value,
        conversationType: 'C2C',
        payload: {
          file: res
        },
        onProgress: function(event) {}
      });
      message.loading = true
      msgList.value.push(message)
      scrollBottom()
      tim.sendMessage(message).then((res) => {
        const index = msgList.value.findIndex(el => el.ID === message.ID)
        const rmessage = {
          ...res.data.message,
          loading: false
        }
        msgList.value.splice(index, 1, rmessage)
      })
    }
  })
}
function showAudio () {
  audioMaskTouch()
  uni.navigateTo({
		url: '/pages/calling/calling'
	})
}
function goBack () {
	uni.navigateBack()
}
function goVideo () {
  audioMaskTouch()
  uni.showToast({
    icon: 'none',
    title: '敬请期待',
  });
}
function goCard () {
  audioMaskTouch()
  uni.navigateTo({
		url: '/pages/card/card'
	})
}
function audioPress () {
  audioVisible.value = true
}
function audioMaskTouch () {
  audioMessage.value.forEach(el => {
    el && el.closeTip()
  })
  audioVisible.value = false
}
</script>

<style lang="scss">
.chat-main{
  .chat-mask{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0);
  }
}
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

  .top-tip{
    position: absolute;
    top: calc(150rpx + var(--status-bar-height));
    left: 0;
    width: 100%;
    z-index: 101;
    color: rgba(255,255,255,0.5);
    font-size: 24rpx;
    text-align: center;
  }

  .chat-star{
    margin: 17rpx 0;
    display: flex;
    .star-back{
      display: flex;
      align-items: center;
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
      align-items: center;
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
  .top-mask{
    position: absolute;
    top: calc(130rpx + var(--status-bar-height));
    left: 0;
    width: 100%;
    z-index: 100;
    background-image: url('../../static/chat-bg.png');
    background-size: 100% auto;
    background-position: 0 calc(-130rpx - var(--status-bar-height));
    mask-image: linear-gradient(to bottom, rgba(255,255,255,1) calc(100% - 80rpx), rgba(255,255,255,0) 100%);
    transition: height 0.1s linear;
  }
}
</style>

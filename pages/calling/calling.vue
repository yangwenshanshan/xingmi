<template>
  <view class="calling">
    <view class="calling-avatar">
      <image style="width: 330rpx" src="../../static/default-icon.png" mode="widthFix"></image>
      <view class="avatar-name">易烊千玺</view>
    </view>
    <view class="calling-called" v-if="isCalling">
      <image style="width: 298rpx" src="../../static/chat-calling.gif" mode="widthFix"></image>
    </view>
    <view class="calling-waiting" v-else>等待对方接受邀请…</view>
    <view class="calling-opt">
      <view class="opt-item">
        <image style="width: 122rpx" src="../../static/chat-microphone.png" mode="widthFix"></image>
        <view>麦克风已开</view>
      </view>
      <view class="opt-item" @click="hangUp">
        <image style="width: 122rpx" src="../../static/chat-hangUp.png" mode="widthFix"></image>
        <view>挂断</view>
      </view>
      <view class="opt-item">
        <image style="width: 122rpx" src="../../static/chat-speaker.png" mode="widthFix"></image>
        <view>扬声器已开</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const isCalling = ref(false)

function hangUp () {
  isCalling.value = false
  goBack()
}
function goBack () {
	uni.navigateBack()
}
</script>

<style lang="scss">
.calling{
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(15px);
  position: relative;
  background: #1E1E1ECC;
  color: #FFFFFF;
  .calling-avatar{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 200rpx;
    .avatar-name{
      margin-top: 50rpx;
      font-size: 48rpx;
    }
  }
  .calling-waiting{
    font-size: 32rpx;
    color: #898989;
    text-align: center;
    margin-top: 95rpx;
  }
  .calling-called{
    display: flex;
    justify-content: center;
    margin-top: 95rpx;
  }
  .calling-opt{
    position: absolute;
    bottom: 270rpx;
    width: 100%;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 108rpx;
    box-sizing: border-box;
    .opt-item{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 22rpx;
      image{
        margin-bottom: 10rpx;
      }
    }
  }
}
</style>

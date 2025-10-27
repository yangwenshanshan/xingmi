<template>
	<view class="chat-list">
		<BasePage>
			<view class="home-title">
				<image @click="goBack" style="width: 14rpx;" src="../../static/bar-back.png" mode="widthFix"></image>
				<p></p>
			</view>
			<view class="mine-top" @click="goPeopleChoose">
				<image class="top-avatar" :src="avatar" mode="widthFix" />
        <view class="top-name">
          <view class="name-info">
            <view class="info-text">{{ name }}</view>
            <view class="info-bg"></view>
          </view>
          <view class="start-info">
            <image src="../../static/mine-star.png" mode="widthFix"></image>
          </view>
        </view>
			</view>
		</BasePage>
		<Bar :actived="4"></Bar>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { getImage } from '../../utils/util'
import { logoutMethod, tim, timEvent } from '../../utils/tim'

const userInfo = ref(null)
onLoad(() => {
  userInfo.value = uni.getStorageSync('userInfo')
})
const name = computed(() => {
  if (userInfo.value) {
    return `${userInfo.value.last_name}${userInfo.value.first_name}`
  } else {
    return ''
  }
})
const avatar = computed(() => {
  if (userInfo.value) {
    return getImage(userInfo.value.avatar)
  } else {
    return ''
  }
})
function goBack () {
	uni.navigateBack()
}
function goPeopleChoose () {
  tim.off(timEvent.SDK_NOT_READY, logoutMethod)
  tim.logout()
  uni.reLaunch({
    url: '/pages/home/home'
  })
}
</script>

<style lang="scss">
.chat-list{
	.home-title{
		position: relative;
		margin-top: 50rpx;
		font-family: Questrial;
		font-weight: 400;
		font-size: 40rpx;
		color: #000000;
		text-align: center;
		align-items: center;
		line-height: 1;
		height: 40rpx;
		image{
			position: absolute;
			width: 29rpx;
			height: 29rpx;
			left: 34rpx;
			top: 0;
			bottom: 0;
			margin: auto 0;
		}
	}
  .mine-top{
    padding: 20rpx 54rpx 0 54rpx;
    display: flex;
    .top-avatar{
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      margin-right: 30rpx;
    }
    .top-name{
      .name-info{
        display: flex;
        align-items: center;
        .info-text{
          font-size: 40rpx;
          font-weight: bold; 
          margin-right: 13rpx;
        }
        .info-bg{
          width: 83rpx;
          height: 40rpx;
          background: linear-gradient(90deg, #FF51D4 0%, #FF4281 100%);
          border-radius: 12rpx;
        }
      }
      .start-info{
        image{
          display: block;
          width: 84rpx;
        }
      }
    }
  }
}
</style>

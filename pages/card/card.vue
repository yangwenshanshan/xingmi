<template>
	<view class="card">
    <view class="status_bar"></view>
    <view class="home-title">
      <p>Starrice</p>
    </view>
    <view class="card-img">
      <image mode="widthFix" style="width: 100%;" src="../../static/card-bg.png"></image>
      <view class="close" @click="goBack"></view>
    </view>
  </view>
</template>

<script setup>
function goBack () {
	uni.navigateBack()
}
</script>

<style lang="scss">
.card{
  background: #161616;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .home-title{
		margin-top: 50rpx;
		font-family: Questrial;
		font-weight: 400;
		font-size: 40rpx;
		color: #FFFFFF;
		text-align: center;
		align-items: center;
		line-height: 1;
		height: 40rpx;
    margin-bottom: 20rpx;
	}
  .card-img{
    position: relative;
    .close{
      position: absolute;
      top: 1138rpx;
      left: 336rpx;
      width: 75rpx;
      height: 75rpx;
    }
  }
}
</style>

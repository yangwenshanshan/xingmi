<template>
	<view class="chat-list">
		<BasePage>
			<view class="home-title">
				<image @click="goBack" style="width: 14rpx;" src="../../static/bar-back.png" mode="widthFix"></image>
				<p>Starrice</p>
			</view>
			<view class="home-search">
				<image src="../../static/shopping-search.png" mode="widthFix" />
			</view>
      <view class="home-tab">
				<image src="../../static/shopping-tab.png" mode="widthFix" />
			</view>
			<scroll-view class="shopping-list" scroll-y>
        <view class="shopping-item">
          <image src="../../static/shopping-list.png" mode="widthFix"></image>
        </view>
			</scroll-view>
		</BasePage>
		<Bar :actived="3"></Bar>
	</view>
</template>

<script setup>
function goBack () {
	uni.navigateBack()
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
	.home-search{
		width: 696rpx;
		height: 78rpx;
		margin: 20rpx auto 0 auto;
		image{
			width: 100%;
		}
	}
  .home-tab{
    width: 600rpx;
		height: 58rpx;
		margin: 20rpx auto 0 auto;
		image{
			width: 100%;
		}
  }
	.shopping-list{
		height: calc(100% - 270rpx);
    .shopping-item{
      width: 698rpx;
      height: 1236rpx;
      margin: 0 auto 0 auto;
      padding-top: 28rpx;
      image{
        width: 100%;
        display: block;
      }
    }
	}
}
</style>

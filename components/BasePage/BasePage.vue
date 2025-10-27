<template>
  <view class="base-page">
    <view class="page-top-left"></view>
    <view class="page-top-right"></view>
    <view class="status_bar"></view>
    <view class="content-main">
      <slot></slot>
    </view>
  </view>
</template>
<script>
export default {
}
</script>
<style lang="scss">
.base-page{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .page-top-left{
    position: absolute;
    top: 0;
    left: 0;
    width: 870rpx;
    height: 334rpx; 
    background: url('../../static/topbar-left.png') no-repeat center center;
    background-size: 100% auto;
    z-index: 2;
  }
  .page-top-right{
    position: absolute;
    right: 0;
    top: 0;
    width: 738rpx;
    height: 332rpx;
    background: url('../../static/topbar-right.png') no-repeat center center;
    background-size: 100% auto;
    z-index: 1;
  }
  .content-main{
    position: absolute;
    top: var(--status-bar-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--status-bar-height));
    z-index: 3;
  }
}
</style> 
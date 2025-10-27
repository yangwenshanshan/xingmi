<template>
	<view class="chat">
    <view class="chat-masked">
      <view class="masked-bottom">
        <view class="masked-bottom-2"></view>
      </view>
    </view>
	</view>
</template>

<script setup>
</script>

<style lang="scss">
.chat{
  width: 100vw;
  height: 100vh;
  
  background-image: linear-gradient(2.56deg, rgba(45, 0, 27, 0.5) 74.79%, rgba(84, 29, 62, 0) 98.81%), url('../../static/chat-bg.png');
  background-size: 100% 300rpx, 100% auto;
  background-repeat: no-repeat no-repeat;
  background-position: center bottom, center top;
  mask-image: linear-gradient(top, rgba(0,0,0,1) 74rpx, rgba(0,0,0,0) 100%);
  .chat-masked{
    // width: 100%;
    // height: 100%;
    // position: relative;
    // backdrop-filter: blur(20px);
    
    .masked-bottom{
      // position: absolute;
      // bottom: -121rpx;
      // left: 0;
      // height: 516rpx;
      // width: 100%;
      // // background: ;
      // background-blend-mode: multiply;
      // backdrop-filter: blur(20px);
      // mask-image: linear-gradient(2.56deg, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
    }
    // .masked-bottom-2{
    //   position: absolute;
    //   top: -10px;
    //   left: 0;
    //   height: 100rpx;
    //   width: 100%;
      
    //   // background: linear-gradient(2.56deg, rgba(45, 0, 27, 0.5) 74.79%, rgba(84, 29, 62, 0) 98.81%);
    //   backdrop-filter: blur(20px);
    // }
  }
}
</style>

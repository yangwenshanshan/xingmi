<template>
	<BasePage>
    <view class="home-index-title">
      <p>请选择需要测试的用户</p>
    </view>
    <view class="user-item" v-for="(item, index) in userList" :key="index" @click="chooseItem(item)">
      <view class="item-name">{{ item.name }}</view>
    </view>
    <!-- <c-lottie :data="start" width="750rpx" height='750rpx' :loop="true"></c-lottie> -->
  </BasePage>
</template>

<script setup>
import { tim, timEvent } from '../../utils/tim';
import http from '../../utils/http'
import { ref } from 'vue';
import { setToken } from '../../utils/config';
// import start from "../../static/lottie/Animation1.json";

const userList = ref([
  {
    name: '石文涛',
    token: 'R7wqiuNarHCUWwX3r-PXMdPU5wPI4xn3'
  },
  {
    name: '杨德升',
    token: 'wvIWg0FaJmNxC340c9xnBvhJ3TwTIMOE'
  },
  {
    name: '杨温珊',
    token: 'Tx24NJznrt8ka1leJvx2Re3-ZgEDSolD'
  }
])

function chooseItem (item) {
  setToken(item.token)
  	uni.showLoading({
		mask:true
	})
  getUserInfo().then(res => {
    if (res.tencent_im_usersig) {
      imLogin(res.id, res.tencent_im_usersig).catch(() => {
        updateUserSig().then(() => {
          getUserInfo().then(response => {
            if (response.tencent_im_usersig) {
              imLogin(response.id, response.tencent_im_usersig)
            }
          })
        })
      })
    } else {
      updateUserSig().then(() => {
        getUserInfo().then(response => {
          if (response.tencent_im_usersig) {
            imLogin(response.id, response.tencent_im_usersig)
          }
        })
      })
    }
  })
}

function getUserInfo () {
  return new Promise((resolve, reject) => {
    http.get('/users/me').then(res => {
      uni.setStorageSync('userInfo', res.data)
      resolve(res.data)
    }).catch(() => {
      reject()
    })
  })
}

function imLogin (userID, userSig) {
  console.log('userID', userID, userSig)
  return new Promise((resolve, reject) => {
    tim.login({userID, userSig }).then(imResponse => {
      console.log('登录成功', imResponse);
      uni.hideLoading()
      tim.on(timEvent.SDK_READY, (event) => {
        uni.redirectTo({
          url: '/pages/index/index'
        })
        resolve()
      });
    }).catch((imError) => {
      reject(imError)
    });
  })
}

function updateUserSig () {
  return http.post('/http-service/im/usersig/update')
}
</script>

<style lang="scss">
.home-index-title{
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
}
.user-item{
  padding: 20rpx;
}
</style>

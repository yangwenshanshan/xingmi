import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';

const SDKAPPID = 1600109731
const SECRETKEY = '835fec65f12412ca101f2305662392384e4437d3a83a422f2f1e778a2692c002'
const options = {
  SDKAppID: SDKAPPID
};
const chat = TencentCloudChat.create(options);
chat.setLogLevel(0);
// chat.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, logoutFn);

function logoutFn () {
  uni.showModal({
    title: '提示',
    content: '用户登出',
    showCancel: false,
    success: () => {
      uni.redirectTo({
        url: '/pages/home/home'
      })
    }
  })
}
export const logoutMethod = logoutFn
export const tim = chat
export const timEvent = TencentCloudChat.EVENT
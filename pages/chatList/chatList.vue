<template>
	<view class="chat-list">
		<BasePage>
			<view class="home-title">
				<image @click="goBack" style="width: 14rpx;" src="../../static/bar-back.png" mode="widthFix"></image>
				<p>Starrice</p>
			</view>
			<view class="home-search">
				<image src="../../static/chat-list-title.png" mode="widthFix" />
			</view>
			<scroll-view class="people-list" scroll-y>
				<view class="people-item" v-for="item in chatList" :key="item.id">
					<view class="item-content" @click="goChat(item)">
						<view class="item-avatar">
							<image mode="widthFix" v-if="item.idol && item.idol.user && item.idol.user.avatar" :src="getImage(item.idol.user.avatar)"></image>
							<image mode="widthFix" v-else src="../../static/default-icon.png"></image>
							<view class="avatar-count" v-if="item.unReadCount" :class="item.unReadCount < 99 ? 'round' : 'auto-round'">{{ item.unReadCount }}</view>
						</view>
						<view class="item-info">
							<view class="info-name">{{ item.idol.name }}</view>
							<template v-if="item.messages && item.messages[0]">
								<view class="info-text" v-if="item.messages[0].content_type === 'text'">{{ item.messages[0].text_content }}</view>
								<view class="info-text" v-if="item.messages[0].content_type === 'image'">[图片]</view>
								<view class="info-text" v-if="item.messages[0].content_type === 'video'">[视频]</view>
								<view class="info-text" v-if="item.messages[0].content_type === 'audio'">[语音]</view>
							</template>
						</view>
						<view class="item-time" v-if="item.messages && item.messages[0]">{{ formatTime(item.messages[0].date_created) }}</view>
					</view>
				</view>
			</scroll-view>
		</BasePage>
		<Bar :actived="2"></Bar>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onShow, onLoad, onUnload, onHide } from '@dcloudio/uni-app'
import { getUserInfo } from '../../utils/config'
import http from '../../utils/http'
import { getImage } from '../../utils/util'
import { tim, timEvent } from '../../utils/tim'

const chatList = ref([])
function goChat (item) {
	if (item.unReadMessage && item.unReadMessage.length) {
		http.patch('/items/chat_messages', {
			data: {
				is_read: true
			},
			keys: item.unReadMessage.map(el => el.id)
		})
	}
	uni.navigateTo({
		url: `/pages/chat/chat?idol=${item.idol.id}&chat=${item.id}`
	})
}
function formatTime(timestamp) {
	const date = new Date(timestamp);
	const now = new Date();

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	const isToday = now.toDateString() === date.toDateString();
	const isYesterday = now.toDateString() === new Date(date.setDate(date.getDate() + 1)).toDateString();

	if (isToday) {
		return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
	} else if (isYesterday) {
			return '昨天';
	} else {
		if (year === now.getFullYear()) {
			return `${month}月${day}日`;
		} else {
			return `${year}年${month}月${day}日`;
		}
	}
}
function getChatUnReadCount () {
	return http.get('/items/chat', {
		limit: 20,
		filter: {
			_and: [
				{
					user: {
						_eq: getUserInfo().id
					}
				}
			]
		},
		fields: [
			'id',
			'messages.id',
			'messages.date_created',
		],
		sort: '-messages.date_created',
		page: 1,
		deep: {
			messages: {
				_filter: {
					role: 'idol',
					is_read: false
				},
			}
		}
	})
}
function getChatList () {
	return http.get('/items/chat', {
		limit: 20,
		filter: {
			_and: [
				{
					user: {
						_eq: getUserInfo().id
					}
				}
			]
		},
		fields: [
			'id',
			'heat_value',
			'idol.user',
			'idol.user.avatar',
			'idol.name',
			'idol.id',
			'user.id',
			'user.first_name',
			'user.last_name',
			'user_defined_prompt',
			'messages.*',
		],
		sort: '-messages.date_created',
		page: 1,
		deep: {
			messages: {
				_limit: 1,
				_sort: '-date_created',
			}
		}
	})
}
function onMessageReceived () {
	onshowFun()
}
onShow(() => {
	tim.on(timEvent.MESSAGE_RECEIVED, onMessageReceived);
})
onHide(() => {
	tim.off(timEvent.MESSAGE_RECEIVED, onMessageReceived);
})
onShow(() => {
	onshowFun()
})
function onshowFun () {
	Promise.all([getChatList(), getChatUnReadCount()]).then(responses => {
		const [ lists, counts ] = responses
		const list = lists.data
		const count = counts.data
		console.log(counts)
		list.forEach(element => {
			const item = count.find(el => el.id === element.id)
			if (item && item.messages) {
				element.unReadMessage = [ ...item.messages ]
				element.unReadCount = item.messages.length
			}
		})
		chatList.value = list
	})
}
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
		height: 114rpx;
		margin: 109rpx auto 0 auto;
		image{
			width: 100%;
		}
	}
	.people-list{
		height: calc(100% - 300rpx - 22rpx);
		.item-content{
			padding: 22rpx 30rpx;
			height: 152rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.item-avatar{
				margin-right: 24rpx;
				display: flex;
				align-items: center;
				position: relative;
				image{
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
				}
				.avatar-count{
					position: absolute;
					top: -16rpx;
					right: -9rpx;
					background-color: #FF0000;
					height: 34rpx;
					font-size: 21rpx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 34rpx;
				}
				.round{
					width: 34rpx;
				}
				.auto-round{
					width: fit-content;
					padding: 0 5rpx;
				}
			}
			.item-info{
				flex: 1;
				.info-name{
					font-size: 32rpx;
					font-weight: bold;
					color: #141414;
				}
				.info-text{
					width: 400rpx;
					color: #A1A1A1;
					font-size: 26rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.item-time{
				margin-top: 8rpx;
				color: #ADADAD;
				font-size: 22rpx;
				height: 100%;
			}
		}
	}
}
</style>

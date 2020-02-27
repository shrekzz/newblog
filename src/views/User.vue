<template>
	<div>
		<nav-header />
		<div class="row">
			<el-card class="user-message" shadow="never">
				<div class="avatar">
					<el-avatar :src="userMessage.authorAvatarUrl" :size="80" />
				</div>
				<div class="user-group" >
					<div class="username"  v-title :data-title='userMessage.authorName'>{{ userMessage.authorName }}</div>
					<div class="description" >
						{{
						userMessage.description
						? userMessage.description
						: "一句话介绍你自己"
						}}
					</div>
				</div>
				<div class="user-edit">
					<el-button v-if="userMessage.authorID === userID" @click="()=>{this.$router.push('/settings')}">编辑个人资料</el-button>
					<div v-else>
						<el-button
							type="success"
							v-if="
                                this.$store.state.followers.includes(
                                    userMessage.authorName
                                )
                            "
							@click.stop="
                                follow(
                                    userMessage.authorID,
                                    userMessage.authorName,
                                    true
                                )
                            "
						>已关注</el-button>
						<el-button
							class="follow-btn"
							@click.stop="
                                follow(
                                    userMessage.authorID,
                                    userMessage.authorName
                                )
                            "
							v-else
						>关&emsp;注</el-button>
					</div>
				</div>
			</el-card>
			<el-card class="user-nav" :body-style="{padding: '0'}">
				<ul class="user-nav-ul">
					<router-link
						class="user-nav-li"
						v-for="(item, idx) in navArr"
						:key="idx"
						tag="li"
						active-class="li-actived"
						@click="show(item.param)"
						:to="{
                            path: `/user/${$route.params.userid}/${item.param}`
                        }"
					>{{ item.liName }}</router-link>
				</ul>
			</el-card>
			<router-view :userFollowers="userMessage.followers" :userFans="userMessage.fans"></router-view>
		</div>
		<nav-footer />
	</div>
</template>
<script>
import Content from "@/components/Content";
export default {
	data() {
		return {
			articles: [],
			userMessage: {},
			activeIdx: 0,
			navArr: [
				{ liName: "文章", param: "articles" },
				{ liName: "关注", param: "followers" },
				{ liName: "粉丝", param: "fans" },
				{ liName: "赞", param: "likes" }
			]
		};
	},
	components: {
		// Card,
		// Avatar,
		// Button,
		Content
		
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		userID() {
			return this.$store.state.userID;
		},
		avatarUrl() {
			return this.$store.state.avatarUrl;
		}
	},
	methods: {
		show() {
			const id = this.$route.params.userid;
			axios
				.post(`/users/user/message`, { userID: id })
				.then(response => {
					let res = response.data;
					if (res.status == 1) {
						this.userMessage = res.result;
					}
				});
		},
		follow(id, name, followToggle = false) {
			if(!this.$store.state.user) {
				this.$store.commit("showDialog", true)
				return
			}
			//id: 被关注人ID
			//name: 被关注人名字
			//followToggle :关注状态 true则执行取消关注操作，默认fasle,关注
			let followedID = id;
			let userID = this.$store.state.userID;
			let userName = this.$store.state.user;
			let oldFollowers = [...this.$store.state.followers];
			let newFollowers;
			if (followToggle) {
				let inx = oldFollowers.indexOf(name);
				oldFollowers.splice(inx, 1);
				newFollowers = oldFollowers;
			} else {
				oldFollowers.push(name);
				newFollowers = oldFollowers;
			}

			axios
				.post("/users/user/follow", {
					followedID,
					userID,
					userName,
					newFollowers: newFollowers.join(),
					followToggle
				})
				.then(response => {
					let res = response.data;
					if (res.status === "1") {
						this.$store.commit("setFollowersFans", {
							followers: newFollowers
						});
					}
				});
		}
	},
	mounted() {
		this.show();
	},
	watch: {
		$route: function(newUrl, oldUrl) {
			if (newUrl != oldUrl) {
				this.show();
			}
		}
    },
    // beforeRouteEnter (to, from, next) {
    //     next(vm => {
    //         // 通过 `vm` 访问组件实例
    //         console.log(vm['userMessage'])
    //         document.title =  `${vm.userMessage.authorName}的个人主页`;
    //     })
    // },
    directives:{
		title:{
			//生命周期 update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新
			update(el){
				 document.title = el.dataset.title + '的个人主页'
			}
		}
	}
	
};
</script>
<style lang="scss" scoped>
.li-actived {
	color: #409eff;
	border-bottom: 2px #409eff solid !important;
}
.user-message {
	margin-top: 10px;
	border-radius: 2px;
	height: 120px;
	.avatar {
		float: left;
		width: 80px;
		height: 80px;
		margin: 0 10px;
	}
	.user-group {
		margin: 0 10px;
		float: left;
		.username {
			font-size: 25px;
			font-weight: bold;
		}
		.description {
			font-size: 14px;
			margin-top: 10px;
			color: #c2c2c2;
		}
	}
	.user-edit {
		float: right;
	}
}
.user-nav {
	border-radius: 0;
	.user-nav-ul {
		text-align: center;
		float: left;
		.user-nav-li {
			width: 80px;
			float: left;
			line-height: 45px;
			border-bottom: 2px transparent solid;
			cursor: pointer;
			&:hover {
				color: #409eff;
			}
		}
	}
}
.follow-btn {
	border-color: #67c23a;
}
</style>

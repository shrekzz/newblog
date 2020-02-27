<template>
	<div>
		<el-card class="box-card">
			<div>
				<i class="el-icon-chat-dot-round">&nbsp;评论</i>
			</div>

			<div class="avatar-input">
				<div>
					<el-avatar :size="60" :src="avatarUrl"></el-avatar>
				</div>
				<div class="input-content">
					<el-input v-model="inputContent" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容"></el-input>
				</div>
			</div>
			<div class="publish-btn">
				<div style="width:70px;" class="el-button el-button--text">
					<router-link to="/login" v-show="!isLogin">登录</router-link>
				</div>
				<el-button
					type="primary"
					v-bind:class="{ 'is-disabled' : !( isLogin && inputContent) }"
					@click="publish(null)"
				>发布</el-button>
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-col>
					<div>
						<span
							class="sort-default"
							@click="changeSort(0);getComment(sortFlag)"
							v-bind:class="{'sort':sortFlag == 0}"
						>按时间 ↑</span>
						<el-divider direction="vertical"></el-divider>
						<span
							class="sort-default"
							type="text"
							@click="changeSort(1);getComment(sortFlag)"
							v-bind:class="{'sort':sortFlag == 1}"
						>按时间 ↓</span>
					</div>
				</el-col>
			</el-row>
			<br />
			<div v-for="item in commentContent" v-if="!item.parentComment" class="comment-list">
				<div>
					<el-avatar :size="40" :src="item.authorAvatarUrl"></el-avatar>
				</div>
				<div class="avatar-right">
					<div>
						<span class="name">{{item.authorName}}</span>
						<div class="comment-content">{{ item.commentContent }}</div>
					</div>
					<div class="time-anwser">
						<div>
							<span class="time">{{ item.commentTime }}</span>
						</div>
						<div>
							<span class="answerlike" @click="toggle(item.commentID)">回复</span>
						</div>
					</div>
					<div class="add-child-comment" v-show="(item.commentID == currentID)">
						<div class="add-child-comment-content">
							<el-input v-model="childInput" placeholder="请输入内容"></el-input>
							<div style="float:right">
								<el-button
									type="primary"
									style="margin-top:10px"
									@click="publish(item.commentID)"
									v-bind:class="{ 'is-disabled' : !childInput }"
								>评论</el-button>
							</div>
						</div>
					</div>
					<!-- - ----------------------------------子评论--------------------------------------- -->
					<div class="child-all-comment">
						<div
							v-for="(child,key) in commentContent"
							v-if="child.parentComment == item.commentID"
							:key="key"
							class="child-list"
						>
							<div class="child-list-content">
								<div class="child-avatar">
									<el-avatar :size="40" :src="item.authorAvatarUrl"></el-avatar>
								</div>
								<div style="width:100%;margin-right:20px">
									<div class="child-name">{{child.authorName}}</div>
									<div class="child-content">{{ child.commentContent }}</div>
									<div class="time-anwser">
										<div class="child-time">{{child.commentTime}}</div>
										<div class="child-anwser" @click.stop="toggle(child.commentID)">回复</div>
									</div>
									<div v-show="(child.commentID == currentID)">
										<div class="add-grandchild-comment">
											<div class="add-grandchild-comment-content">
												<el-input v-model="childInput" placeholder="请输入内容"></el-input>
												<div style="float:right">
													<el-button
														type="primary"
														@click="publish(item.commentID)"
														v-bind:class="{ 'is-disabled' : !childInput }"
														style="margin-top: 10px"
													>评论</el-button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<el-divider></el-divider>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			inputContent: "",
			childInput: "",
			commentContent: "",
			currentID: "",
			isLogin: this.$store.state.user == null ? false : true,
			sortFlag: 0
		};
	},
	methods: {
		toggle(id) {
			//第一次点回复 cId 等于传进来的id ，再点同一个回复，cId置空
			if (id == this.currentID) {
				this.currentID = "";
			} else {
				this.currentID = id;
				this.childInput = "";
			}
		},
		losefocus(id) {
			this.currentID = "";
			this.childInput = "";
		},
		getComment(sort) {
			let articleID = this.$route.query.articleID;
			axios
				.post("/users/getComment", {
					articleID: articleID,
					sort: sort
				})
				.then(response => {
					let res = response.data;
					if (res.status == 0) {
						this.commentContent = res.result.commentContent;
					}
				});
		},
		publish(parentID) {
			if (this.$store.state.user) {
				let articleID = this.$route.query.articleID;
				let commentContent = this.inputContent;
				let parentComment = parentID;
				let avatar = this.$store.state.avatarUrl;
				if (parentComment) {
					commentContent = this.childInput;
				}
				axios
					.post("/users/publish", {
						articleID: articleID,
						commentContent: commentContent,
						parentComment: parentComment,
						avatar: avatar
					})
					.then(response => {
						let res = response.data;
						if (res.status == 0) {
							this.inputContent = "";
							this.childInput = "";
							this.getComment();
						}
					});
			} else {
				this.$message("您还没有登录，无法评论！");
			}
			this.currentID = "";
			this.childInput = "";
		},
		changeSort(sort) {
			this.sortFlag = sort;
		}
	},
	mounted() {
		this.getComment();
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		avatarUrl() {
			return this.$store.state.avatarUrl;
		}
	},
	components: {
		axios
	}
};
</script>
<style scoped>
</style>
<style>
.comment-list {
	display: flex;
	margin: 20px;
}
.avatar-input {
	display: flex;
	margin: 30px 0;
}
.input-content {
	margin-left: 10px;
	width: 100%;
}
.publish-btn {
	display: flex;
	justify-content: flex-end;
}
.answerlike {
	color: darkblue;
	font-size: 13px;
	cursor: pointer;
}
.sort-default {
	font-size: 13px;
	color: black;
	cursor: pointer;
}
.sort {
	font-size: 13px;
	color: #eb7350;
	cursor: pointer;
}
.name {
	color: darkblue;
	font-size: 18px;
}
.comment-content {
	line-height: 25px;
	margin: 10px 0;
}
.avatar-right {
	width: 100%;
	margin: 0 20px;
	word-wrap: break-word; /*文字超出换行 */
	word-break: break-all;
	overflow: hidden;
}
.time-anwser {
	display: flex;
	justify-content: space-between;
}

.time {
	color: darkblue;
	font-size: 13px;
}

.child-anwser {
	color: darkblue;
	font-size: 12px;
	cursor: pointer;
}

.child-time {
	color: darkblue;
	font-size: 12px;
}

.child-content {
	color: black;
	font-size: 14px;
	line-height: 25px;
	margin: 10px 0;
}
.child-name {
	color: darkblue;
	font-size: 16px;
}
.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both;
}

.child-comment {
	font-family: "microsoft yahei";
	font-size: 14px;
	color: darkgray;
	margin: 0 auto;

	/* height: 250px; */
	/* overflow: hidden;   自动隐藏文字 */
	/*         
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis; */
}
.add-child-comment {
	background-color: #ebebeb;
	width: 100%;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
}
.add-child-comment-content {
	width: 100%;
	margin: 0 10px;
}
.add-grandchild-comment {
	background-color: #dcdfe6;
	width: 100%;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
}
.add-grandchild-comment-content {
	width: 100%;
	margin: 0 10px;
}
.child-all-comment {
	background-color: #fafbfc;
	margin-top: 20px;
}
.child-list {
	border-bottom: 1px solid #ebebeb;
	padding: 15px 0;
}
.child-list-content {
	display: flex;
	padding: 0 10px;
}
.child-avatar {
	margin-right: 10px;
}
</style>

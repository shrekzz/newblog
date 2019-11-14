<template>
	<div>
		<el-card class="box-card">
			<div>
				<i class="el-icon-chat-dot-round">&nbsp;评论</i>
			</div>
			<br />
			<el-row>
				<el-col :xs="4" :sm="3" :md="3" :lg="2">
					<el-avatar :size="50" :src="avatarUrl"></el-avatar>
				</el-col>
				<el-col :xs="18" :sm="19" :md="19" :lg="20">
					<el-input v-model="inputContent" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容"></el-input>
				</el-col>
			</el-row>
			<br />
			<el-row>
				<el-col :xs="{offset:12}" :sm="{offset:15}" :md="{offset:20}" :lg="1">
					<div style="width:70px;" class="el-button el-button--text">
						<router-link to="/login" v-show="!isLogin">登录</router-link>
					</div>
					<el-button
						type="primary"
						v-bind:class="{ 'is-disabled' : !( isLogin && inputContent) }"
						@click="publish(null)"
					>发布</el-button>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row>
				<el-col>
					<div>
						<span
							class="sort-default"
							@click="changeSort(0);getComment(sortFlag)"
							v-bind:class="{'sort':sortFlag == 0}"
						>按时间↑</span>
						<el-divider direction="vertical"></el-divider>
						<span
							class="sort-default"
							type="text"
							@click="changeSort(1);getComment(sortFlag)"
							v-bind:class="{'sort':sortFlag == 1}"
						>按时间↓</span>
					</div>
				</el-col>
			</el-row>
			<br />
			<div v-for="item in commentContent" v-if="!item.parentComment">
				<el-row>
					<el-col :push="1" :span="2" :xs="{push:0}">
						<el-avatar :size="40" :src="item.authorAvatarUrl"></el-avatar>
					</el-col>
					<el-col :push="1" :span="20" :xs="{push:2}">
						<span class="name">{{item.authorName}}：</span>
						<span class="comment-content">{{ item.commentContent }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :push="3" :span="2" :xs="{push:1,span:4}">
						<p>
							<span class="time">{{ item.commentTime }}</span>
						</p>
					</el-col>
					<el-col :push="20" :span="2" :xs="{push:17,span:6}">
						<p>
							<span class="answerlike" @click="toggle(item.commentID)">回复</span>
						</p>
					</el-col>
				</el-row>
				<el-row v-show="(item.commentID == currentID)">
					<el-col :push="3">
						<div class="add-child-comment">
							<el-input v-model="childInput" style="width: 80%;" placeholder="请输入内容"></el-input>
							<el-button type="primary" style="width: 18%;" @click="publish(item.commentID)" v-bind:class="{ 'is-disabled' : !childInput }">评论</el-button>
						</div>
					</el-col>
				</el-row>
				<br />
				<el-row
					v-for="(child,key) in commentContent"
					v-if="child.parentComment == item.commentID"
					:key="key"
				>
					<el-col :push="1">
						<el-card class="child-comment" shadow="never">
							<br />
							<el-row>
								<el-col :push="1" :span="22">
									<span class="child-name">{{child.authorName}}：</span>
									<span class="child-content">{{ child.commentContent }}</span>
								</el-col>
							</el-row>
							<el-row>
								<el-col :push="1" :span="3" :xs="{span:6}">
									<p>
										<span class="child-time">{{child.commentTime}}</span>
									</p>
								</el-col>
								<el-col :push="20" :span="2" :xs="{push:16}">
									<p>
										<span class="child-anwser" @click="toggle(child.commentID)">回复</span>
									</p>
								</el-col>
								<el-row v-show="(child.commentID == currentID)">
								<el-col :push="1">
									<div class="add-grandchild-comment">
										<el-input v-model="childInput" style="width: 80%;" placeholder="请输入内容"></el-input>
										<el-button type="primary" style="width: 18%;" @click="publish(item.commentID)" v-bind:class="{ 'is-disabled' : !childInput }">评论</el-button>
									</div>
								</el-col>
				</el-row>
							</el-row>
							<!-- </div> -->
						</el-card>
					</el-col>
				</el-row>
				<br />
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
				
				return;
			}
			this.currentID = id;
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
			if(this.$store.state.user){
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
			}else{
				this.$message('您还没有登录，无法评论！');
			}
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
	font-size: 16px;
	color: #eb7350;
	cursor: pointer;
}
.name {
	color: darkblue;
	font-size: 16px;
}
.comment-content {
	line-height: 25px;
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
}
.child-name{
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
	width: 83%;
	/* height: 250px; */
	/* overflow: hidden;   自动隐藏文字 */
	/*         
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis; */
}
.add-child-comment {
	background-color: #dcdfe6;
	width: 82%;
	height: 50px;
	padding-top: 10px;
	padding-left: 10px;
}
.add-grandchild-comment {
	background-color: #dcdfe6;
	width: 95%;
	height: 50px;
	padding-top: 10px;
	padding-left: 10px;
}
</style>

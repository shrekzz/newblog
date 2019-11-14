<template>
	<div>
		<nav-header></nav-header>
		<el-row>
            
			<el-col :span="19" :xs="{span:24}" >
				<div class="container">
                    <el-card class="box-card" shadow="hover" v-show="articles.length == 0"><p style="text-align:center">草稿箱为空</p></el-card>
					<el-card class="box-card" shadow="hover" v-for="(item,idx) in articles" :key="idx">
						<span class="p-top"><a href="#">{{item.articleAuthor}}</a> · {{item.articleTime}}</span>
						<h3>{{item.articleTitle}}</h3>
						<p>{{item.articleContent.substr(0,100)}}</p>
						<br>
						<div class="edit">
							<span><router-link :to="{path:'edit', query: {'articleID': item.articleID} }">编辑</router-link></span>
							<el-divider direction="vertical"></el-divider>
							<span><a href="javascript:;" @click="open(item)">删除</a></span> 
						</div>
					</el-card>
					<div
					class="loadMore"
					v-infinite-scroll="loadMore"
					infinite-scroll-disabled="busy"
					infinite-scroll-distance="30"
				>
					<i class="el-icon-loading" v-show="loading"></i>
				</div>
				</div>
			</el-col>
			<el-col :span="5" :xs="{ span: 0}">
				<nav-aside></nav-aside>
			</el-col>
		</el-row>
		<nav-footer></nav-footer>
	</div>
</template>

<style>
    .loadMore{line-height: 10; text-align: center;}
</style>

<script>
import axios from "axios";

import NavHeader from "@/components/NavHeader.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavAside from "@/components/NavAside.vue";
export default {
	components: {
		NavHeader,
		NavAside,
		NavFooter
	},
	data() {
		return {
			articles: [],
			page: 1,
			pageSize: 5,
			loading: false,
			busy: true,
			
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init(flag, user) {
			let param = {
				user: this.user,
				page: this.page,
                pageSize: this.pageSize,
                draft: 'draft'
			};
			this.loading = true;
			axios.get("/index", { params: param }).then(response => {
				let res = response.data;
				this.loading = false;
				if (res.status == 0) {
					if (flag) {
						this.articles = this.articles.concat(
							res.result.articles
						);
						if (res.result.count == 0) {
							this.busy = true;
						} else {
							this.busy = false;
						}
					} else {
						this.articles = res.result.articles;
						this.busy = false;
					}

					
				}
			});
		},
		delArticle(item) {
			axios
				.post("/users/delete", { articleID: item.articleID })
				.then(response => {
					let res = response.data;
					if (res.data == 0) {
						console.log("successs");
					}
				});
		},
		open(item) {
			this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.delArticle(item);
					this.$message({
						type: "success",
						message: "删除成功!"
					});
					this.$router.go(0)
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
		},

		loadMore() {
			this.busy = true;
			setTimeout(() => {
				this.page++;
				this.init(true);
			}, 200);
		}
	}
};
</script>
<style  scoped>

 .edit a{
     font-size: 13px;
     color: grey;
 }
 .edit a:hover{
     font-size: 13px;
     color: #409EFF;
 }
</style>
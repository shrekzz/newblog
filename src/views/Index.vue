<template>
	<div>
		<nav-header></nav-header>
		<section class="main floatfix">
			<nav-aside :flag="flag" @Logout="Logout"></nav-aside>
			<section class="main-articles">
				<ul>
					<li v-for="item in articles" class="main-articles-item">
						<h2>
							<router-link
								:to="{path:'article', query: {'articleID': item.articleID} }"
							>{{item.articleTitle}}</router-link>
						</h2>
						<section class="main-articles-item-des">
							<p>
								<span>作者：{{item.articleAuthor}}</span>
								<span>发布时间： {{item.articleTime}}</span>
								<span>浏览量：{{item.articleClick}}</span>
								<span class="delete" v-show="flag">
									<a href="javascript:;" @click="open(item)">&emsp;删除</a>
								</span>
								<span class="modify" v-show="flag">
									<router-link :to="{path:'edit', query: {'articleID': item.articleID} }">编辑</router-link>
								</span>
							</p>
						</section>
					</li>
				</ul>
				<div
					class="loadMore"
					v-infinite-scroll="loadMore"
					infinite-scroll-disabled="busy"
					infinite-scroll-distance="30"
				>
					<i class="el-icon-loading" v-show="loading"></i>
				</div>
			</section>
		</section>
		<nav-footer></nav-footer>
	</div>
</template>

<style>
    .loadMore{line-height: 10; text-align: center;}
</style>

<script>
import axios from "axios";
import "./../assets/css/main.css";
import "./../assets/css/normalize.css";

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
			busy: true
		};
	},
	computed: {
		flag() {
			return this.$store.state.flag;
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init(flag) {
			let param = {
				page: this.page,
				pageSize: this.pageSize
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

					if (res.result.user) {
						this.$store.commit("updateFlag", true);
					}
				}
			});
		},
		Logout() {
			axios.post("/users/logout").then(response => {
				let res = response.data;
				if (res.status == 0) {
					this.$store.commit("updateFlag", false);
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
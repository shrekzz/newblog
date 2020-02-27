<template>
	<div>
        <nav-header />
		<el-row class="row">
			<el-col style="margin-top: 20px">
				<el-card class="box-card article-card">
					<div v-title :data-title="article.articleTitle">
						<span class="authormsg">
							作者：
							<span class="author" @click="toUser(article.articleAuthor)">
								{{
								article.articleAuthor
								}}
							</span>
							&emsp;{{ article.articleTime }}&emsp;阅读
							{{ article.articleClick }}
						</span>
						<h1>{{ article.articleTitle }}</h1>
					</div>
					<mavon-editor
						style="box-shadow: none"
						class="content"
						:ishljs="true"
						:subfield="prop.subfield"
						:toolbarsFlag="prop.toolbarsFlag"
						:editable="prop.editable"
						:defaultOpen="prop.defaultOpen"
						:previewBackground="prop.previewBackground"
						v-model="article.articleContent"
					/>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="comment">
			<el-col>
				<comment></comment>
			</el-col>
		</el-row>
        <nav-footer />
	</div>
</template>
<script>
import NavAside from "@/components/NavAside.vue";
import Comment from "@/components/Comment.vue";

export default {
	components: {
		NavAside,
        Comment,
	},
	data() {
		return {
			article: []
		};
	},
	computed: {
		prop() {
			let data = {
				subfield: false, //单栏
				defaultOpen: "preview", //预览
				editable: false, //不可编辑
				toolbarsFlag: false, //不显示工具栏
				previewBackground: "#ffffff"
			};
			return data;
		}
	},
	mounted() {
		this.getArticle();
	},
	methods: {
		getArticle() {
			var articleID = this.$route.query.articleID;
			axios
				.post("/users/articleContent", {
					articleID: articleID
				})
				.then(response => {
					let res = response.data;
					if (res.status == 0) {
						this.article = res.result.article;
					}
				});
		},
		toUser(param) {
            axios.post('/index/name2id', { authorName: param }).then(response => {
                let res = response.data
                if(res.status === '1') {
                    let id = res.result.authorID
                    this.$router.push(`/user/${id}/articles`);
                }
            })
        }
	},
	directives: {
		title: {
			//生命周期 update: 被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新
			update(el) {
				document.title = el.dataset.title;
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.content {
	margin-top: 20px;
	z-index: 90;
}
.author {
	color: black;
	cursor: pointer;
	&:hover {
		color: grey;
	}
}
.authormsg {
	font-size: 13px;
	color: grey;
}
.comment {
	max-width: 960px;
	margin: 0 auto;
}
</style>

<template>
	<div>
		<nav-header></nav-header>
		<section class="main floatfix">
			<nav-aside></nav-aside>
			<section class="main-articles articles">
				<section class="main-articles-title">
					<h2>{{article.articleTitle}}</h2>
					<p>
						<span>作者：{{article.articleAuthor}}</span>
						<span>发布时间：{{article.articleTime}}</span>
						<span>浏览量：{{article.articleClick}}</span>
					</p>
				</section>
				<section class="main-articles-content">
					<div v-html="article.articleContent"></div>
				</section>
			</section>
			<section class="main-articles">
				<comment></comment>
			</section>
		</section>
		<nav-footer></nav-footer>
	</div>
</template>
<script>
import axios from "axios";
import "./../assets/css/main.css";
import "./../assets/css/normalize.css";
import NavHeader from "@/components/NavHeader.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavAside from "@/components/NavAside.vue";
import Comment from "@/components/Comment.vue";

let marked = require("marked");
let hljs = require("highlight.js");
import "highlight.js/styles/default.css";

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	highlight: function(code, lang) {
		if (lang && hljs.getLanguage(lang)) {
			return hljs.highlight(lang, code, true).value;
		} else {
			return hljs.highlightAuto(code).value;
		}
	}
});

export default {
	components: {
		NavHeader,
		NavAside,
		NavFooter,
		Comment
	},
	data() {
		return {
			article: []
		};
	},
	computed: {
		flag() {
			return this.$store.state.flag;
		}
	},
	mounted() {
		this.getArticle();
	},
	methods: {
		getArticle() {
			var articleID = this.$route.query.articleID;
			axios
				.post("/users/articleContent", { articleID: articleID })
				.then(response => {
					let res = response.data;
					if (res.status == 0) {
                        res.result.article.articleContent = marked(res.result.article.articleContent || '');
                        this.article = res.result.article

					}
				});
		}
	}
};
</script>
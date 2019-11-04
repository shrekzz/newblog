<template>
	<div>
		<nav-header></nav-header>
		<el-row>
			<el-col :span="16" :offset="3">
				<div class="article">
					<el-card class="box-card article-card" >
						<h2>{{article.articleTitle}}</h2>
						<span class="authormsg">作者：Node&emsp;{{article.articleTime}}&emsp;阅读 {{article.articleClick}} </span>
						<!-- <div v-html="article.articleContent"></div>  -->
						 <mavon-editor 
						 	class="editor" 
							 :ishljs="prop.ishljs"  
							 :subfield="prop.subfield" 
							 :toolbarsFlag="prop.toolbarsFlag"
							 :editable="prop.editable"
							 :defaultOpen="prop.defaultOpen" 
							 :previewBackground="prop.previewBackground"
							 v-model="article.articleContent"/>
						
						
					</el-card>
				</div>
			</el-col>
			<el-col :span="5">
				<nav-aside></nav-aside>
			</el-col>
			<!-- <el-col :span="5">
				<el-card class="box-card">
					目录
					<ul><li>1.这是一级目录</li></ul>
				</el-card>
			</el-col> -->
		</el-row>
		<el-row>
			<el-col :span="16" :offset="3">
				<comment></comment>
			</el-col>
		</el-row>
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
		prop(){
			let data = {
				subfield: false,  //单栏
				defaultOpen: 'preview',  //预览
				editable: false,   //不可编辑
				ishljs: true,     //代码高亮
				toolbarsFlag: false,  //不显示工具栏
				previewBackground: '#ffffff'
			}
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
				.post("/users/articleContent", { articleID: articleID })
				.then(response => {
					let res = response.data;
					if (res.status == 0) {
                       // res.result.article.articleContent = marked(res.result.article.articleContent || '');
                        this.article = res.result.article

					}
				});
		}
	}
};
</script>
<style scoped>

.editor{
        width: 99%;
		margin-top:20px;
        z-index: 90;
	}
.authormsg{
	font-size: 13px; 
	color: grey;
}
</style>
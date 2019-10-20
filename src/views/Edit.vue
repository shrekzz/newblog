<template>
    <div>
        <nav-header></nav-header>
        <section class="main floatfix">
            <nav-aside></nav-aside>
                <section class="main-articles">
                    <form class="edit">
                        <div class="form-group">
                            <label for="">标&emsp;&emsp;&emsp;题</label>
                            <input type="text" name="title" v-model="title" >
                            
                        </div>
                        <div class="text-group">
                            <!-- <label for="">内容</label>
                            <textarea name="content" v-model="content"></textarea>  -->
                             <mavon-editor v-model="content" class="editor"/>
                        </div>
                        <p class="btn"><el-button type="primary" @click="save" v-bind:class="{'is-disabled': !(title && content)}">保&emsp;存</el-button></p>
                        <!-- <p class="btn"><input type="button" @click="save" value="保存"></p> -->
                    </form>

                    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%"center>
                        <span>文章发布成功！</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="back">返回首页</el-button>
                        </span>
                    </el-dialog>
                </section>

        </section>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import axios from "axios";
    import './../assets/css/main.css'
    import './../assets/css/normalize.css'

    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavAside from '@/components/NavAside.vue'
   
export default {
    components: {
        NavHeader,
        NavAside,
        NavFooter
    },
    data(){
        return{
            // markdownOption:{
            //     bold: true, // 粗体
            //     italic: true, // 斜体
            //     header: true, // 标题
            //     underline: true, // 下划线
            //     strikethrough: true, // 中划线
            //     mark: true, // 标记
            //     superscript: true, // 上角标
            //     subscript: true, // 下角标
            //     quote: true, // 引用
            //     ol: true, // 有序列表
            //     ul: true, // 无序列表
            //     link: true, // 链接
            //     imagelink: false, // 图片链接
            //     code: true, // code
            //     table: false, // 表格
            //     fullscreen: true, // 全屏编辑
            //     readmodel: true, // 沉浸式阅读
            //     htmlcode: true, // 展示html源码
            //     help: true, // 帮助
            //     /* 1.3.5 */
            //     undo: true, // 上一步
            //     redo: true, // 下一步
            //     trash: true, // 清空
            //     save: true, // 保存（触发events中的save事件）
            //     /* 1.4.2 */
            //     navigation: true, // 导航目录
            //     /* 2.1.8 */
            //     alignleft: true, // 左对齐
            //     aligncenter: true, // 居中
            //     alignright: true, // 右对齐
            //     /* 2.2.1 */
            //     subfield: true, // 单双栏模式
            //     preview: true, // 预览
            // }
            title: "",
            content: "",
            centerDialogVisible: false
        }
        
    },
    mounted(){
        this.initEdit()
    },
    methods:{
        initEdit(){
            var articleID = this.$route.query.articleID
            var edit = true
            if(articleID){
                axios.post('/users/articleContent',{articleID: articleID, edit: edit}).then(response => {
                    let res  = response.data
                    if(res.status == 0){
                        this.title = res.result.article.articleTitle
                        this.content = res.result.article.articleContent
                    }
                })
            }
        },
        save(){
            var articleID = this.$route.query.articleID
            axios.post('/users/editArticle',{title: this.title, content: this.content, articleID: articleID}).then( response => {
                let res = response.data
                if(res.status == 0){
                    this.centerDialogVisible = true
                }
            })
        },
        back(){
            this.centerDialogVisible = false
            this.$router.push({
                path: '/'
            })
        }
    }
}
</script>
<style scoped>
    .editor{
        min-height: 370px;
        max-height: 370px;
        width: 900px;
    }
</style>
<template>
    <div>
        <nav-header></nav-header>
            <el-row>
                <el-col :span="19">
                    <el-card class="box-card" >
                        <form class="edit">
                            <div class="form-group">
                                <label for="">标&emsp;&emsp;&emsp;题</label>
                                <input type="text" name="title" v-model="title" >
                                
                            </div>
                            <div class="text-group">
                                <!-- <label for="">内容</label>
                                <textarea name="content" v-model="content"></textarea>  -->
                                <mavon-editor ref=md @imgAdd="$imgAdd" v-model="content" class="editor" :ishljs = "true"></mavon-editor>
                            </div>
                            <p class="btn"><el-button type="primary" @click="save" v-bind:class="{'is-disabled': !(title && content)}">保&emsp;存</el-button></p>
                            <!-- <p class="btn"><input type="button" @click="save" value="保存"></p> -->
                        </form>
                    </el-card>
                    </el-col>
                    <el-col :span="5">
                        <nav-aside></nav-aside>
                    </el-col>
            </el-row>
        <nav-footer></nav-footer>
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%"center>
            <span>文章发布成功！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="back">返回首页</el-button>
            </span>
        </el-dialog>
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
        },
         $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('file', $file);
           axios({
               url: '/users/upload',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
           }).then((url) => {
               // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
                var imgurl = url.data.url
               
               /**
               * $vm 指为mavonEditor实例，可以通过如下两种方式获取
               * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
               * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
               */
               this.$refs.md.$img2Url(pos, imgurl);
           })
        },
        
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